<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function getSalesReport(string $period, array $params = []): array
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');

        switch ($period) {
            case 'weekly':
                $startDate = isset($params['start_date']) 
                    ? Carbon::parse($params['start_date'], $timezone)->startOfDay() 
                    : Carbon::now($timezone)->startOfWeek();
                $endDate = isset($params['end_date']) 
                    ? Carbon::parse($params['end_date'], $timezone)->endOfDay() 
                    : Carbon::now($timezone)->endOfWeek();
                $periodLabel = 'Mingguan (' . $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y') . ')';
                break;

            case 'monthly':
                $year = (int) ($params['year'] ?? Carbon::now($timezone)->year);
                $month = (int) ($params['month'] ?? Carbon::now($timezone)->month);
                $startDate = Carbon::createFromDate($year, $month, 1, $timezone)->startOfMonth();
                $endDate = $startDate->copy()->endOfMonth();
                $periodLabel = 'Bulanan (' . $startDate->translatedFormat('F Y') . ')';
                break;

            case 'yearly':
                $year = (int) ($params['year'] ?? Carbon::now($timezone)->year);
                $startDate = Carbon::createFromDate($year, 1, 1, $timezone)->startOfYear();
                $endDate = $startDate->copy()->endOfYear();
                $periodLabel = 'Tahunan (' . $year . ')';
                break;

            case 'daily':
            default:
                $period = 'daily';
                $date = isset($params['date']) 
                    ? Carbon::parse($params['date'], $timezone) 
                    : Carbon::now($timezone);
                $startDate = $date->copy()->startOfDay();
                $endDate = $date->copy()->endOfDay();
                $periodLabel = 'Harian (' . $startDate->format('d M Y') . ')';
                break;
        }

        $orders = Order::with(['items.product.category', 'bankAccount'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $paidOrders = $orders->where('payment_status', 'paid');
        $unpaidOrders = $orders->where('payment_status', '!=', 'paid')->where('status', '!=', 'cancelled');
        $cancelledOrders = $orders->where('status', 'cancelled');

        $totalRevenue = (float) $paidOrders->sum('total_price');
        $totalOrdersCount = $orders->count();
        $paidOrdersCount = $paidOrders->count();
        $averageOrderValue = $paidOrdersCount > 0 ? round($totalRevenue / $paidOrdersCount, 2) : 0;

        $totalItemsSold = 0;
        $productSales = [];

        foreach ($paidOrders as $order) {
            foreach ($order->items as $item) {
                $totalItemsSold += $item->quantity;
                $pId = $item->product_id;

                if (!isset($productSales[$pId])) {
                    $productSales[$pId] = [
                        'product_id' => $pId,
                        'product_name' => $item->product?->name ?? 'Produk Dihapus',
                        'category_name' => $item->product?->category?->name ?? '-',
                        'total_quantity' => 0,
                        'total_revenue' => 0,
                    ];
                }

                $productSales[$pId]['total_quantity'] += $item->quantity;
                $productSales[$pId]['total_revenue'] += (float) ($item->price * $item->quantity);
            }
        }

        usort($productSales, fn($a, $b) => $b['total_quantity'] <=> $a['total_quantity']);
        $topProducts = array_slice($productSales, 0, 5);

        $paymentMethods = [];
        foreach ($paidOrders as $order) {
            $bankName = $order->bankAccount?->bank_name ?? 'Tunai / Lainnya';
            if (!isset($paymentMethods[$bankName])) {
                $paymentMethods[$bankName] = [
                    'name' => $bankName,
                    'total_orders' => 0,
                    'total_amount' => 0,
                ];
            }
            $paymentMethods[$bankName]['total_orders']++;
            $paymentMethods[$bankName]['total_amount'] += (float) $order->total_price;
        }

        $breakdown = $this->buildTimeBreakdown($period, $startDate, $endDate, $paidOrders);

        return [
            'period' => $period,
            'period_label' => $periodLabel,
            'start_date' => $startDate->toDateTimeString(),
            'end_date' => $endDate->toDateTimeString(),
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrdersCount,
                'paid_orders' => $paidOrdersCount,
                'unpaid_orders' => $unpaidOrders->count(),
                'cancelled_orders' => $cancelledOrders->count(),
                'total_items_sold' => $totalItemsSold,
                'average_order_value' => $averageOrderValue,
            ],
            'payment_methods' => array_values($paymentMethods),
            'top_selling_products' => $topProducts,
            'breakdown' => $breakdown,
        ];
    }

    protected function buildTimeBreakdown(string $period, Carbon $startDate, Carbon $endDate, $paidOrders): array
    {
        $breakdown = [];

        switch ($period) {
            case 'daily':
                $hours = [
                    '00:00 - 04:00' => [0, 3],
                    '04:00 - 08:00' => [4, 7],
                    '08:00 - 12:00' => [8, 11],
                    '12:00 - 16:00' => [12, 15],
                    '16:00 - 20:00' => [16, 19],
                    '20:00 - 24:00' => [20, 23],
                ];

                foreach ($hours as $label => [$startHour, $endHour]) {
                    $segmentOrders = $paidOrders->filter(function ($order) use ($startHour, $endHour) {
                        $hour = $order->created_at->hour;
                        return $hour >= $startHour && $hour <= $endHour;
                    });

                    $breakdown[] = [
                        'label' => $label,
                        'orders_count' => $segmentOrders->count(),
                        'revenue' => (float) $segmentOrders->sum('total_price'),
                    ];
                }
                break;

            case 'weekly':
                $current = $startDate->copy();
                while ($current->lte($endDate)) {
                    $dayStr = $current->format('Y-m-d');
                    $segmentOrders = $paidOrders->filter(function ($order) use ($dayStr) {
                        return $order->created_at->format('Y-m-d') === $dayStr;
                    });

                    $breakdown[] = [
                        'date' => $dayStr,
                        'label' => $current->translatedFormat('l, d M'),
                        'orders_count' => $segmentOrders->count(),
                        'revenue' => (float) $segmentOrders->sum('total_price'),
                    ];

                    $current->addDay();
                }
                break;

            case 'monthly':
                $current = $startDate->copy();
                while ($current->lte($endDate)) {
                    $dayStr = $current->format('Y-m-d');
                    $segmentOrders = $paidOrders->filter(function ($order) use ($dayStr) {
                        return $order->created_at->format('Y-m-d') === $dayStr;
                    });

                    $breakdown[] = [
                        'date' => $dayStr,
                        'label' => $current->format('d M'),
                        'day' => (int) $current->format('d'),
                        'orders_count' => $segmentOrders->count(),
                        'revenue' => (float) $segmentOrders->sum('total_price'),
                    ];

                    $current->addDay();
                }
                break;

            case 'yearly':
                for ($m = 1; $m <= 12; $m++) {
                    $monthCarbon = Carbon::createFromDate($startDate->year, $m, 1);
                    $segmentOrders = $paidOrders->filter(function ($order) use ($m) {
                        return (int) $order->created_at->month === $m;
                    });

                    $breakdown[] = [
                        'month' => $m,
                        'label' => $monthCarbon->translatedFormat('F'),
                        'orders_count' => $segmentOrders->count(),
                        'revenue' => (float) $segmentOrders->sum('total_price'),
                    ];
                }
                break;
        }

        return $breakdown;
    }
}

<?php

namespace App\Services;

use App\Http\Resources\OrderResource;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Get real-time dashboard analytics
     */
    public function getDashboardStats(): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // 1. Today's metrics
        $todayOrdersQuery = Order::whereDate('created_at', $today);
        $todayOrdersCount = (clone $todayOrdersQuery)->count();
        $todayRevenue = (float) (clone $todayOrdersQuery)
            ->where('status', '!=', 'cancelled')
            ->sum('total_price');

        // Yesterday's metrics for trends
        $yesterdayOrdersCount = Order::whereDate('created_at', $yesterday)->count();
        $yesterdayRevenue = (float) Order::whereDate('created_at', $yesterday)
            ->where('status', '!=', 'cancelled')
            ->sum('total_price');

        $ordersTrend = $yesterdayOrdersCount > 0
            ? round((($todayOrdersCount - $yesterdayOrdersCount) / $yesterdayOrdersCount) * 100, 1)
            : ($todayOrdersCount > 0 ? 100 : 0);

        $revenueTrend = $yesterdayRevenue > 0
            ? round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1)
            : ($todayRevenue > 0 ? 100 : 0);

        // Pending & Completed Orders
        $pendingOrdersCount = Order::whereIn('status', ['pending', 'preparing'])
            ->orWhere('payment_status', 'awaiting_verification')
            ->count();

        $completedOrdersCount = Order::where('status', 'completed')
            ->whereDate('created_at', $today)
            ->count();

        // 2. Weekly sales (last 7 days)
        $weeklyData = [];
        $dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayRevenue = (float) Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');

            $weeklyData[] = [
                'label' => $dayNames[$date->dayOfWeek],
                'date' => $date->format('Y-m-d'),
                'amount' => $dayRevenue,
                'isToday' => $i === 0,
            ];
        }

        // 3. Hourly sales (today: 10:00 to 22:00)
        $hourlyData = [];
        $currentHour = Carbon::now()->hour;
        for ($h = 10; $h <= 21; $h++) {
            $hourStart = Carbon::today()->setHour($h)->setMinute(0)->setSecond(0);
            $hourEnd = (clone $hourStart)->addHour();

            $hourRevenue = (float) Order::whereBetween('created_at', [$hourStart, $hourEnd])
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');

            $hourlyData[] = [
                'label' => sprintf('%02d:00', $h),
                'amount' => $hourRevenue,
                'isCurrentHour' => $currentHour === $h,
            ];
        }

        // 4. Restaurant vs Raw Material revenue breakdown today
        $restaurantSlugs = ['makanan-utama', 'korean-street-food', 'sup-jjigae', 'banchan-side-dish', 'minuman', 'dessert'];
        $ordersTodayWithItems = Order::with('items.product.category')
            ->whereDate('created_at', $today)
            ->where('status', '!=', 'cancelled')
            ->get();

        $restaurantRevenue = 0;
        $rawRevenue = 0;

        foreach ($ordersTodayWithItems as $ord) {
            foreach ($ord->items as $item) {
                $catSlug = $item->product?->category?->slug ?? '';
                $itemSubtotal = (float) ($item->price * $item->quantity);
                if (in_array($catSlug, $restaurantSlugs) || str_contains($catSlug, 'menu') || str_contains($catSlug, 'restaurant')) {
                    $restaurantRevenue += $itemSubtotal;
                } else {
                    $rawRevenue += $itemSubtotal;
                }
            }
        }

        $totalCategorized = $restaurantRevenue + $rawRevenue;
        $restaurantPercent = $totalCategorized > 0 ? round(($restaurantRevenue / $totalCategorized) * 100, 1) : 70;
        $rawPercent = $totalCategorized > 0 ? round(($rawRevenue / $totalCategorized) * 100, 1) : 30;

        $completedTodayOrders = Order::where('status', 'completed')
            ->whereDate('created_at', $today)
            ->get();
        $avgOrderValue = $completedTodayOrders->count() > 0
            ? round($completedTodayOrders->sum('total_price') / $completedTodayOrders->count())
            : 0;

        // 5. Recent orders (latest 10)
        $recentOrders = Order::with(['items.product.category', 'user'])
            ->latest()
            ->limit(10)
            ->get();

        // 6. Inactive / low stock products (e.g. is_active is false or general overview)
        $lowStockProducts = Product::where('is_active', false)
            ->orWhereNull('description')
            ->limit(6)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock' => $p->is_active ? 5 : 0,
                    'status' => $p->is_active ? 'Available' : 'Sold Out',
                    'category' => $p->category?->name ?? 'General',
                ];
            });

        return [
            'stats' => [
                'todayOrders' => (string) $todayOrdersCount,
                'todayOrdersTrend' => ($ordersTrend >= 0 ? "+{$ordersTrend}%" : "{$ordersTrend}%"),
                'todayRevenue' => '₩' . number_format($todayRevenue, 0, ',', '.'),
                'todayRevenueNumeric' => $todayRevenue,
                'todayRevenueTrend' => ($revenueTrend >= 0 ? "+{$revenueTrend}%" : "{$revenueTrend}%"),
                'pendingOrders' => (string) $pendingOrdersCount,
                'completedOrders' => (string) $completedOrdersCount,
            ],
            'salesOverview' => [
                'weeklyData' => $weeklyData,
                'hourlyData' => $hourlyData,
                'restaurantRevenue' => $restaurantRevenue,
                'formattedRestaurantRevenue' => '₩' . number_format($restaurantRevenue, 0, ',', '.'),
                'restaurantPercent' => $restaurantPercent,
                'rawRevenue' => $rawRevenue,
                'formattedRawRevenue' => '₩' . number_format($rawRevenue, 0, ',', '.'),
                'rawPercent' => $rawPercent,
                'avgOrderValue' => $avgOrderValue,
                'formattedAvgOrderValue' => '₩' . number_format($avgOrderValue, 0, ',', '.'),
                'completedCount' => $completedTodayOrders->count(),
            ],
            'recentOrders' => OrderResource::collection($recentOrders),
            'lowStockProducts' => $lowStockProducts,
        ];
    }

    /**
     * Get transaction report by date / month filter
     */
    public function getTransactionReport(array $filters): array
    {
        $periodType = $filters['period_type'] ?? ($filters['period'] ?? 'today');
        $selectedDate = $filters['date'] ?? Carbon::today()->format('Y-m-d');
        $selectedMonth = $filters['month'] ?? Carbon::today()->format('Y-m');

        $query = Order::with(['items.product.category', 'user'])->latest();

        if ($periodType === 'today') {
            $query->whereDate('created_at', Carbon::parse($selectedDate));
        } elseif ($periodType === 'daily' || !empty($filters['date'])) {
            $query->whereDate('created_at', Carbon::parse($selectedDate));
        } elseif ($periodType === 'month' || !empty($filters['month'])) {
            $date = Carbon::parse($selectedMonth . '-01');
            $query->whereYear('created_at', $date->year)
                  ->whereMonth('created_at', $date->month);
        }

        $orders = $query->get();

        $totalOrders = $orders->count();
        $completedOrders = $orders->where('status', 'completed')->count();
        $cancelledOrders = $orders->where('status', 'cancelled')->count();
        $totalRevenue = (float) $orders->where('status', '!=', 'cancelled')->sum('total_price');

        return [
            'summary' => [
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'cancelledOrders' => $cancelledOrders,
                'totalRevenue' => $totalRevenue,
                'formattedRevenue' => '₩' . number_format($totalRevenue, 0, ',', '.'),
                'period' => $periodType,
                'selectedDate' => $selectedDate,
                'selectedMonth' => $selectedMonth,
            ],
            'orders' => OrderResource::collection($orders),
        ];
    }

    /**
     * Get financial report by month
     */
    public function getFinancialReport(array $filters): array
    {
        $selectedMonth = $filters['month'] ?? Carbon::today()->format('Y-m');
        $date = Carbon::parse($selectedMonth . '-01');

        $orders = Order::with(['items.product.category'])
            ->whereYear('created_at', $date->year)
            ->whereMonth('created_at', $date->month)
            ->where('status', '!=', 'cancelled')
            ->get();

        $completedOrders = $orders->where('status', 'completed');
        $totalRevenue = (float) $orders->sum('total_price');
        $completedCount = $completedOrders->count();
        $avgOrderValue = $completedCount > 0 ? round($completedOrders->sum('total_price') / $completedCount) : 0;

        $restaurantSlugs = ['makanan-utama', 'korean-street-food', 'sup-jjigae', 'banchan-side-dish', 'minuman', 'dessert'];
        $restaurantRevenue = 0;
        $rawRevenue = 0;
        $productSales = [];

        foreach ($orders as $ord) {
            foreach ($ord->items as $item) {
                $prod = $item->product;
                $catSlug = $prod?->category?->slug ?? '';
                $itemSubtotal = (float) ($item->price * $item->quantity);

                if (in_array($catSlug, $restaurantSlugs) || str_contains($catSlug, 'menu') || str_contains($catSlug, 'restaurant')) {
                    $restaurantRevenue += $itemSubtotal;
                } else {
                    $rawRevenue += $itemSubtotal;
                }

                if ($prod) {
                    $prodId = $prod->id;
                    if (!isset($productSales[$prodId])) {
                        $productSales[$prodId] = [
                            'id' => $prodId,
                            'name' => $prod->name,
                            'category' => $prod->category?->name ?? 'Menu Restoran',
                            'is_raw' => !in_array($catSlug, $restaurantSlugs),
                            'soldCount' => 0,
                            'revenue' => 0,
                        ];
                    }
                    $productSales[$prodId]['soldCount'] += $item->quantity;
                    $productSales[$prodId]['revenue'] += $itemSubtotal;
                }
            }
        }

        // Sort top products by revenue descending
        usort($productSales, fn($a, $b) => $b['revenue'] <=> $a['revenue']);
        $topProducts = array_map(function ($p) {
            $p['formattedRevenue'] = '₩' . number_format($p['revenue'], 0, ',', '.');
            return $p;
        }, array_slice($productSales, 0, 10));

        $totalCategorized = $restaurantRevenue + $rawRevenue;
        $restaurantPercent = $totalCategorized > 0 ? round(($restaurantRevenue / $totalCategorized) * 100, 1) : 70;
        $rawPercent = $totalCategorized > 0 ? round(($rawRevenue / $totalCategorized) * 100, 1) : 30;

        return [
            'selectedMonth' => $selectedMonth,
            'totalRevenue' => $totalRevenue,
            'formattedRevenue' => '₩' . number_format($totalRevenue, 0, ',', '.'),
            'completedCount' => $completedCount,
            'avgOrderValue' => $avgOrderValue,
            'formattedAvgOrderValue' => '₩' . number_format($avgOrderValue, 0, ',', '.'),
            'breakdown' => [
                'restaurantRevenue' => $restaurantRevenue,
                'formattedRestaurantRevenue' => '₩' . number_format($restaurantRevenue, 0, ',', '.'),
                'restaurantPercent' => $restaurantPercent,
                'rawRevenue' => $rawRevenue,
                'formattedRawRevenue' => '₩' . number_format($rawRevenue, 0, ',', '.'),
                'rawPercent' => $rawPercent,
            ],
            'topProducts' => $topProducts,
        ];
    }
}

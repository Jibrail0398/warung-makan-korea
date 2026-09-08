<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $proofUrl = null;
        if ($this->payment_receipt) {
            $proofUrl = (str_starts_with($this->payment_receipt, 'http://') || str_starts_with($this->payment_receipt, 'https://'))
                ? $this->payment_receipt
                : url('storage/' . $this->payment_receipt);
        }

        // Map status to human-readable format for admin frontend
        $displayStatus = match ($this->status) {
            'pending' => ($this->payment_status === 'awaiting_verification' ? 'Payment Verification' : 'Pending'),
            'preparing' => 'Processing',
            'ready' => 'Ready',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };

        // Payment status mapping
        $displayPaymentStatus = match ($this->payment_status) {
            'paid' => 'Verified',
            'awaiting_verification' => 'Waiting Verification',
            default => 'Unpaid',
        };

        $orderType = $this->table_number ? 'Dine In' : 'Takeaway';
        $customerName = $this->customer_name ?? $this->user?->name ?? 'Customer';
        $customerPhone = $this->customer_phone ?? $this->user?->phone_number ?? '';

        $totalNum = (float) $this->total_price;

        return [
            'id' => $this->id,
            'orderId' => $this->id,
            'orderNumber' => '#' . $this->id,
            'user_id' => $this->user_id,
            'customer_name' => $customerName,
            'customer_phone' => $customerPhone,
            'customer' => [
                'name' => $customerName,
                'phone' => $customerPhone,
            ],
            'table_number' => $this->table_number,
            'tableNumber' => $this->table_number,
            'orderType' => $orderType,
            'total_price' => $totalNum,
            'total' => $totalNum,
            'subtotal' => $totalNum,
            'formattedTotal' => '₩' . number_format($totalNum, 0, ',', '.'),
            'status' => $displayStatus,
            'raw_status' => $this->status,
            'payment_status' => $this->payment_status,
            'paymentStatus' => $displayPaymentStatus,
            'payment_receipt' => $this->payment_receipt,
            'paymentProof' => $proofUrl,
            'payment_receipt_url' => $proofUrl,
            'paymentMethod' => $this->bank_account_id ? 'Bank Transfer' : ($this->payment_receipt ? 'QRIS / Transfer' : 'Cash'),
            'bank_account_id' => $this->bank_account_id,
            'bank_account' => $this->whenLoaded('bankAccount'),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'date' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'time' => $this->created_at ? $this->created_at->format('H:i') : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

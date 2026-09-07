<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    /**
     * Create a new event instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order->loadMissing('items.product');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('new-order'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'new-order-event';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'customer_name' => $this->order->customer_name,
            'customer_phone' => $this->order->customer_phone,
            'table_number' => $this->order->table_number,
            'total_price' => (float) $this->order->total_price,
            'status' => $this->order->status,
            'payment_status' => $this->order->payment_status,
            'items_count' => $this->order->items->sum('quantity'),
            'items' => $this->order->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name ?? 'Produk',
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'sub_total' => (float) ($item->price * $item->quantity),
                ];
            })->values()->toArray(),
            'created_at' => $this->order->created_at?->toIso8601String() ?? now()->toIso8601String(),
            'message' => 'Pesanan baru masuk dari ' . ($this->order->customer_name ?: 'Pelanggan') . 
                ($this->order->table_number ? ' (' . $this->order->table_number . ')' : ' (Take Away)'),
        ];
    }
}

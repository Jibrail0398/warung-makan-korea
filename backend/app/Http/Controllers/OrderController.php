<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $orders = $this->service->getAll(paginate: true);
        return $this->successResponse(
            OrderResource::collection($orders)->response()->getData(true),
            'Berhasil mengambil daftar pesanan'
        );
    }

    public function store(StoreOrderRequest $request)
    {
        $order = $this->service->createOrder($request->validated());
        return $this->successResponse(new OrderResource($order), 'Pesanan berhasil dibuat', 201);
    }

    public function show(Order $order)
    {
        $order->load('items.product');
        return $this->successResponse(new OrderResource($order), 'Detail pesanan');
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order = $this->service->updateStatus($order, $request->validated());
        return $this->successResponse(new OrderResource($order), 'Status pesanan berhasil diperbarui');
    }

    public function uploadReceipt(Request $request, Order $order)
    {
        $request->validate(['payment_receipt' => 'required|image|mimes:jpg,jpeg,png|max:2048']);
        
        $order = $this->service->uploadReceipt($order, $request->file('payment_receipt'));
        return $this->successResponse(new OrderResource($order), 'Bukti pembayaran berhasil diupload');
    }
}

<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required_without:user_id|string|max:255',
            'customer_phone' => 'required_without:user_id|string|max:20',
            'user_id' => 'nullable|exists:users,id',
            'table_number' => 'nullable|string|max:50',
            'bank_account_id' => 'nullable|exists:bank_accounts,id',
            
            // Validation for cart items
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            
            // Payment proof upload (optional initially)
            'payment_receipt' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}

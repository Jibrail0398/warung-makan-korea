<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if (auth('api')->check()) {
            $this->merge([
                'user_id' => $this->input('user_id') ?? auth('api')->id(),
            ]);
        }

        // Handle customer nested object
        if ($this->has('customer') && is_array($this->input('customer'))) {
            $customer = $this->input('customer');
            if (!empty($customer['name']) && !$this->has('customer_name')) {
                $this->merge(['customer_name' => $customer['name']]);
            }
            if (!empty($customer['phone']) && !$this->has('customer_phone')) {
                $this->merge(['customer_phone' => $customer['phone']]);
            }
        }

        if ($this->has('tableNumber') && !$this->has('table_number')) {
            $this->merge(['table_number' => $this->input('tableNumber')]);
        }

        // Normalize items array
        if ($this->has('items') && is_array($this->input('items'))) {
            $normalizedItems = array_map(function ($item) {
                return [
                    'product_id' => $item['product_id'] ?? ($item['productId'] ?? ($item['id'] ?? null)),
                    'quantity' => (int) ($item['quantity'] ?? 1),
                    'price' => $item['price'] ?? null,
                ];
            }, $this->input('items'));

            $this->merge(['items' => $normalizedItems]);
        }
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'user_id' => 'nullable|exists:users,id',
            'table_number' => 'nullable|string|max:50',
            'bank_account_id' => 'nullable|exists:bank_accounts,id',
            'status' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'payment_receipt' => 'nullable',
            
            // Validation for cart items
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }
}

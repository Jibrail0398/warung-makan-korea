<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'sometimes|required|in:pending,preparing,ready,completed,cancelled',
            'payment_status' => 'sometimes|required|in:unpaid,awaiting_verification,paid',
        ];
    }
}

<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Asumsikan otorisasi ditangani middleware
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'price' => 'required|numeric|min:0',
            'weight_or_unit' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ];
    }
}

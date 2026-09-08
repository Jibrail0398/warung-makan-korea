<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $categoryInput = $this->input('category_id') ?? $this->input('subcategoryId') ?? $this->input('categoryId');
        if ($categoryInput) {
            $this->merge(['category_id' => $categoryInput]);
        }

        if ($this->has('numericPrice') && !$this->has('price')) {
            $this->merge(['price' => $this->input('numericPrice')]);
        }

        if ($this->has('unit') && !$this->has('weight_or_unit')) {
            $this->merge(['weight_or_unit' => $this->input('unit')]);
        }

        if ($this->has('status') && !$this->has('is_active')) {
            $this->merge(['is_active' => $this->input('status') === 'Available']);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable',
            'price' => 'required|numeric|min:0',
            'weight_or_unit' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ];
    }
}

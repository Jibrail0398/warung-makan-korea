<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAll(bool $paginate = false, int $perPage = 15, array $filters = [])
    {
        $query = Product::with('category')->latest();

        // Filter by category_id or subcategory_id
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Filter by status / is_active
        if (isset($filters['is_active'])) {
            $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        } elseif (isset($filters['status'])) {
            if ($filters['status'] === 'Available') {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'Sold Out') {
                $query->where('is_active', false);
            }
        }

        // Search by name or description
        if (!empty($filters['search']) || !empty($filters['q'])) {
            $search = $filters['search'] ?? $filters['q'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function create(array $data): Product
    {
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $data['image'] = $data['image']->store('products', 'public');
        }

        if (isset($data['unit']) && !isset($data['weight_or_unit'])) {
            $data['weight_or_unit'] = $data['unit'];
        }

        if (isset($data['numericPrice']) && !isset($data['price'])) {
            $data['price'] = $data['numericPrice'];
        }

        if (isset($data['status'])) {
            $data['is_active'] = $data['status'] === 'Available';
        }

        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            if ($product->image && !str_starts_with($product->image, 'http')) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $data['image']->store('products', 'public');
        }

        if (isset($data['unit']) && !isset($data['weight_or_unit'])) {
            $data['weight_or_unit'] = $data['unit'];
        }

        if (isset($data['numericPrice']) && !isset($data['price'])) {
            $data['price'] = $data['numericPrice'];
        }

        if (isset($data['status'])) {
            $data['is_active'] = $data['status'] === 'Available';
        }

        $product->update($data);
        return $product->fresh(['category']);
    }

    public function delete(Product $product): bool
    {
        if ($product->image && !str_starts_with($product->image, 'http')) {
            Storage::disk('public')->delete($product->image);
        }
        return $product->delete();
    }
}

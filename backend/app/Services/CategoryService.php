<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    public function getAll(bool $paginate = false, int $perPage = 50, array $filters = [])
    {
        $query = Category::withCount('products')->latest();

        if (!empty($filters['search']) || !empty($filters['q'])) {
            $search = $filters['search'] ?? $filters['q'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%")
                  ->orWhere('slug', 'ILIKE', "%{$search}%")
                  ->orWhere('slug', 'LIKE', "%{$search}%");
            });
        }

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function create(array $data): Category
    {
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Handle slug collision
        $originalSlug = $data['slug'];
        $count = 1;
        while (Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if (isset($data['slug']) && $data['slug'] !== $category->slug) {
            $originalSlug = $data['slug'];
            $count = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = "{$originalSlug}-{$count}";
                $count++;
            }
        }

        $category->update($data);
        return $category->fresh(['products']);
    }

    public function delete(Category $category): bool
    {
        return $category->delete();
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rawSlugs = ['bahan-mentah-daging', 'bumbu-sambal', 'beras-sembako', 'camilan-tambahan', 'raw', 'bahan-mentah'];
        $categorySlug = $this->category?->slug ?? '';
        $isRaw = in_array($categorySlug, $rawSlugs);
        $mainCategoryId = $isRaw ? 2 : 1;
        $categoryType = $isRaw ? 'raw' : 'restaurant';

        $imageUrl = null;
        if ($this->image) {
            $imageUrl = (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://'))
                ? $this->image
                : url('storage/' . $this->image);
        }

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'subcategoryId' => $this->category_id,
            'mainCategoryId' => $mainCategoryId,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'categoryType' => $categoryType,
            'name' => $this->name,
            'description' => $this->description ?? '',
            'image' => $imageUrl,
            'image_url' => $imageUrl,
            'price' => (float) $this->price,
            'numericPrice' => (float) $this->price,
            'formattedPrice' => '₩' . number_format((float) $this->price, 0, ',', '.'),
            'weight_or_unit' => $this->weight_or_unit ?? '1 porsi',
            'unit' => $this->weight_or_unit ?? '1 porsi',
            'is_active' => (bool) $this->is_active,
            'isActive' => (bool) $this->is_active,
            'status' => $this->is_active ? 'Available' : 'Sold Out',
            'stock' => $this->is_active ? 25 : 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

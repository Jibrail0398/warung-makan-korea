<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rawSlugs = ['bahan-mentah-daging', 'bumbu-sambal', 'beras-sembako', 'camilan-tambahan', 'raw', 'bahan-mentah'];
        $isRaw = in_array($this->slug, $rawSlugs);
        $mainCategoryId = $isRaw ? 2 : 1;
        $type = $isRaw ? 'raw' : 'restaurant';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $type,
            'mainCategoryId' => $mainCategoryId,
            'productCount' => $this->products_count ?? ($this->relationLoaded('products') ? $this->products->count() : 0),
            'products_count' => $this->products_count ?? ($this->relationLoaded('products') ? $this->products->count() : 0),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

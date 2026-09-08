<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rawSlugs = ['bahan-mentah-daging', 'bumbu-sambal', 'beras-sembako', 'camilan-tambahan', 'raw', 'bahan-mentah'];
        $product = $this->product;
        $catSlug = $product?->category?->slug ?? '';
        $isRaw = in_array($catSlug, $rawSlugs);

        $imageUrl = null;
        if ($product?->image) {
            $imageUrl = (str_starts_with($product->image, 'http://') || str_starts_with($product->image, 'https://'))
                ? $product->image
                : url('storage/' . $product->image);
        }

        $numericPrice = (float) $this->price;
        $subtotal = (float) ($this->price * $this->quantity);

        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'product_id' => $this->product_id,
            'name' => $product?->name ?? 'Item #' . $this->product_id,
            'category' => $isRaw ? 'raw' : 'restaurant',
            'category_name' => $product?->category?->name ?? 'Menu',
            'image' => $imageUrl,
            'quantity' => (int) $this->quantity,
            'price' => $numericPrice,
            'numericPrice' => $numericPrice,
            'formattedPrice' => '₩' . number_format($numericPrice, 0, ',', '.'),
            'subtotal' => $subtotal,
            'sub_total' => $subtotal,
            'formattedSubtotal' => '₩' . number_format($subtotal, 0, ',', '.'),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}

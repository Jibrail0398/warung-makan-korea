<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [];
        if ($request->filled('category_id') && $request->query('category_id') !== 'all') {
            $filters['category_id'] = $request->query('category_id');
        }
        if ($request->filled('search')) {
            $filters['search'] = $request->query('search');
        }

        $perPage = $request->query('per_page', 12);
        $products = $this->service->getAll(paginate: true, perPage: (int)$perPage, activeOnly: true, filters: $filters);
        return $this->successResponse(
            ProductResource::collection($products)->response()->getData(true),
            'Berhasil mengambil daftar produk'
        );
    }

    public function adminIndex(Request $request)
    {
        $status = $request->query('status');
        $isActive = null;
        if ($status === 'Available') {
            $isActive = true;
        } elseif ($status === 'Sold Out') {
            $isActive = false;
        }

        $products = $this->service->getAll(paginate: true, filters: [
            'search' => $request->query('search'),
            'category_id' => $request->query('category_id'),
            'is_active' => $isActive,
        ]);
        return $this->successResponse(
            ProductResource::collection($products)->response()->getData(true),
            'Berhasil mengambil daftar produk'
        );
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->service->create($request->validated());
        return $this->successResponse(new ProductResource($product), 'Produk berhasil dibuat', 201);
    }

    public function show(Product $product)
    {
        $product->load('category');
        return $this->successResponse(new ProductResource($product), 'Detail produk');
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product = $this->service->update($product, $request->validated());
        return $this->successResponse(new ProductResource($product), 'Produk berhasil diperbarui');
    }

    public function destroy(Product $product)
    {
        $this->service->delete($product);
        return $this->successResponse(null, 'Produk berhasil dihapus');
    }
}

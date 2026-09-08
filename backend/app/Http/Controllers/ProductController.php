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
        $paginate = $request->query('paginate', 'true') !== 'false' && $request->query('all') !== 'true';
        $perPage = (int) $request->query('per_page', 50);

        $products = $this->service->getAll(paginate: $paginate, perPage: $perPage, filters: $request->all());

        $data = $paginate
            ? ProductResource::collection($products)->response()->getData(true)
            : ProductResource::collection($products);

        return $this->successResponse($data, 'Berhasil mengambil daftar produk');
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->service->create($request->validated());
        $product->load('category');
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

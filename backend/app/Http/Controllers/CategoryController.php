<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $paginate = $request->query('paginate', 'true') !== 'false' && $request->query('all') !== 'true';
        $perPage = (int) $request->query('per_page', 50);

        $categories = $this->service->getAll(paginate: $paginate, perPage: $perPage, filters: $request->all());

        $data = $paginate
            ? CategoryResource::collection($categories)->response()->getData(true)
            : CategoryResource::collection($categories);

        return $this->successResponse($data, 'Berhasil mengambil daftar kategori');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->service->create($request->validated());
        return $this->successResponse(new CategoryResource($category), 'Kategori berhasil dibuat', 201);
    }

    public function show(Category $category)
    {
        $category->loadCount('products');
        return $this->successResponse(new CategoryResource($category), 'Detail kategori');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category = $this->service->update($category, $request->validated());
        return $this->successResponse(new CategoryResource($category), 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category)
    {
        $this->service->delete($category);
        return $this->successResponse(null, 'Kategori berhasil dihapus');
    }
}

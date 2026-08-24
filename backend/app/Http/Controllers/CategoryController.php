<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $categories = $this->service->getAll(paginate: true);
        return $this->successResponse(
            CategoryResource::collection($categories)->response()->getData(true),
            'Berhasil mengambil daftar kategori'
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->service->create($request->validated());
        return $this->successResponse(new CategoryResource($category), 'Kategori berhasil dibuat', 201);
    }

    public function show(Category $category)
    {
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

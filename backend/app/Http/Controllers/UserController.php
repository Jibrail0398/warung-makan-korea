<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        // Halaman manajemen ini dikhususkan untuk akun dengan role admin.
        $users = $this->service->getAll(paginate: true, role: 'admin');
        return $this->successResponse(
            UserResource::collection($users)->response()->getData(true),
            'Berhasil mengambil daftar pengguna'
        );
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->service->create($request->validated());
        return $this->successResponse(new UserResource($user), 'Pengguna berhasil ditambahkan', 201);
    }

    public function show(User $user)
    {
        return $this->successResponse(new UserResource($user), 'Detail pengguna');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user = $this->service->update($user, $request->validated());
        return $this->successResponse(new UserResource($user), 'Pengguna berhasil diperbarui');
    }

    public function changePassword(ChangePasswordRequest $request, User $user)
    {
        $this->service->changePassword($user, $request->validated('password'));
        return $this->successResponse(null, "Password pengguna {$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user)
    {
        $this->service->delete($user);
        return $this->successResponse(null, 'Pengguna berhasil dihapus');
    }
}

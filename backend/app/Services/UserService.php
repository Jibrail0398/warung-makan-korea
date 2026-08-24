<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;

class UserService
{
    public function getAll(bool $paginate = false, int $perPage = 15)
    {
        $query = User::latest();
        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function create(array $data): User
    {
        // Admin membuat user secara manual
        $data['password'] = bcrypt(str()->random(16));
        $data['phone_number_verified_at'] = Carbon::now(); // Langsung terverifikasi
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}

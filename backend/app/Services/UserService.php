<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAll(bool $paginate = false, int $perPage = 15, ?string $role = null)
    {
        $query = User::latest();

        if ($role !== null) {
            $query->where('role', $role);
        }

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function create(array $data): User
    {
        // Admin membuat user secara manual
        if (empty($data['password'])) {
            $data['password'] = Hash::make(str()->random(16));
        } else {
            $data['password'] = Hash::make($data['password']);
        }
        $data['phone_number_verified_at'] = Carbon::now(); // Langsung terverifikasi
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }

    public function changePassword(User $user, string $newPassword): User
    {
        $user->password = Hash::make($newPassword);
        $user->save();

        $causer = auth('api')->user();

        activity('user_management')
            ->performedOn($user)
            ->causedBy($causer)
            ->event('password_changed')
            ->withProperties([
                'target_user_name' => $user->name,
                'target_user_phone' => $user->phone_number,
                'target_user_role' => $user->role,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log("Superadmin " . ($causer?->name ?? '') . " mengganti password pengguna {$user->name}");

        return $user;
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}

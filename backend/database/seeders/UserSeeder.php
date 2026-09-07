<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin WMK',
                'phone_number' => '081234567890',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Admin Kasir 1',
                'phone_number' => '081298765432',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Admin Kasir 2',
                'phone_number' => '081298765433',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Budi Santoso',
                'phone_number' => '081211112222',
                'password' => Hash::make('password123'),
                'role' => 'member',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Siti Rahmawati',
                'phone_number' => '081233334444',
                'password' => Hash::make('password123'),
                'role' => 'member',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Ahmad Fauzi',
                'phone_number' => '081255556666',
                'password' => Hash::make('password123'),
                'role' => 'member',
                'phone_number_verified_at' => now(),
            ],
            [
                'name' => 'Dewi Lestari',
                'phone_number' => '081277778888',
                'password' => Hash::make('password123'),
                'role' => 'member',
                'phone_number_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['phone_number' => $userData['phone_number']],
                $userData
            );
        }
    }
}

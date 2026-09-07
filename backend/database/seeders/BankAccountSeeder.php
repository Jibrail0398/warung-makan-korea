<?php

namespace Database\Seeders;

use App\Models\BankAccount;
use Illuminate\Database\Seeder;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            [
                'id' => 1,
                'bank_name' => 'BCA (Bank Central Asia)',
                'account_number' => '8735019283',
                'account_name' => 'Warung Makan Korea',
                'is_active' => true,
            ],
            [
                'id' => 2,
                'bank_name' => 'Bank Mandiri',
                'account_number' => '1370019283741',
                'account_name' => 'Warung Makan Korea',
                'is_active' => true,
            ],
            [
                'id' => 3,
                'bank_name' => 'BRI (Bank Rakyat Indonesia)',
                'account_number' => '034101002345531',
                'account_name' => 'Warung Makan Korea',
                'is_active' => true,
            ],
            [
                'id' => 4,
                'bank_name' => 'BNI (Bank Negara Indonesia)',
                'account_number' => '0987654321',
                'account_name' => 'Warung Makan Korea',
                'is_active' => true,
            ],
            [
                'id' => 5,
                'bank_name' => 'Bank Jago',
                'account_number' => '102938475612',
                'account_name' => 'Warung Makan Korea',
                'is_active' => false,
            ],
        ];

        foreach ($accounts as $account) {
            BankAccount::updateOrCreate(
                ['id' => $account['id']],
                $account
            );
        }
    }
}

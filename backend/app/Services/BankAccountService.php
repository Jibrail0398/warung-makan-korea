<?php

namespace App\Services;

use App\Models\BankAccount;
use Illuminate\Validation\ValidationException;

class BankAccountService
{
    public function getAll(bool $onlyActive = false)
    {
        $query = BankAccount::latest();
        
        if ($onlyActive) {
            $query->where('is_active', true);
        }

        return $query->get(); // Bank account biasanya tidak terlalu banyak, tidak perlu pagination
    }

    public function create(array $data): BankAccount
    {
        // Batasi hanya satu rekening bank yang diizinkan.
        if (BankAccount::count() >= 1) {
            throw ValidationException::withMessages([
                'bank_account' => 'Hanya satu rekening bank yang diizinkan. Hapus rekening yang ada terlebih dahulu.',
            ]);
        }

        return BankAccount::create($data);
    }

    public function update(BankAccount $bankAccount, array $data): BankAccount
    {
        $bankAccount->update($data);
        return $bankAccount;
    }

    public function delete(BankAccount $bankAccount): bool
    {
        return $bankAccount->delete();
    }
}

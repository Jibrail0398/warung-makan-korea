<?php

namespace App\Services;

use App\Models\BankAccount;

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

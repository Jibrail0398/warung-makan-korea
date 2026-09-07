<?php

namespace App\Http\Requests\BankAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bank_name' => 'sometimes|required|string|max:100',
            'account_number' => 'sometimes|required|string|max:50|unique:bank_accounts,account_number,' . $this->route('bank_account')->id,
            'account_name' => 'sometimes|required|string|max:100',
            'is_active' => 'boolean',
        ];
    }
}

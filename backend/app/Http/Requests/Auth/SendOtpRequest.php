<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Memastikan format nomor HP (Contoh: +82xxx atau 08xxx atau 62xxx)
            'phone_number' => 'required|string|min:9|max:20',
        ];
    }
}

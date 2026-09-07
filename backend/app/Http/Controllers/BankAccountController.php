<?php

namespace App\Http\Controllers;

use App\Http\Requests\BankAccount\StoreBankAccountRequest;
use App\Http\Requests\BankAccount\UpdateBankAccountRequest;
use App\Http\Resources\BankAccountResource;
use App\Models\BankAccount;
use App\Services\BankAccountService;
use App\Traits\ApiResponse;

class BankAccountController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(BankAccountService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $isActiveOnly = request()->query('active') === 'true';
        
        $accounts = $this->service->getAll(onlyActive: $isActiveOnly);
        return $this->successResponse(
            BankAccountResource::collection($accounts),
            'Berhasil mengambil daftar rekening bank'
        );
    }

    public function store(StoreBankAccountRequest $request)
    {
        $account = $this->service->create($request->validated());
        return $this->successResponse(new BankAccountResource($account), 'Rekening bank berhasil ditambahkan', 201);
    }

    public function show(BankAccount $bankAccount)
    {
        return $this->successResponse(new BankAccountResource($bankAccount), 'Detail rekening bank');
    }

    public function update(UpdateBankAccountRequest $request, BankAccount $bankAccount)
    {
        $account = $this->service->update($bankAccount, $request->validated());
        return $this->successResponse(new BankAccountResource($account), 'Rekening bank berhasil diperbarui');
    }

    public function destroy(BankAccount $bankAccount)
    {
        $this->service->delete($bankAccount);
        return $this->successResponse(null, 'Rekening bank berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function dashboard()
    {
        $data = $this->reportService->getDashboardStats();
        return $this->successResponse($data, 'Berhasil mengambil statistik dashboard');
    }

    public function transactions(Request $request)
    {
        $data = $this->reportService->getTransactionReport($request->all());
        return $this->successResponse($data, 'Berhasil mengambil laporan transaksi');
    }

    public function financial(Request $request)
    {
        $data = $this->reportService->getFinancialReport($request->all());
        return $this->successResponse($data, 'Berhasil mengambil laporan keuangan');
    }
}

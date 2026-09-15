<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function sales(Request $request)
    {
        $period = $request->query('period', 'daily');

        if (!in_array($period, ['daily', 'weekly', 'monthly', 'yearly'])) {
            return $this->errorResponse('Periode tidak valid. Pilihan yang tersedia: daily, weekly, monthly, yearly.', 422);
        }

        $data = $this->reportService->getSalesReport($period, $request->all());

        return $this->successResponse($data, "Laporan penjualan {$data['period_label']} berhasil diambil.");
    }

    public function daily(Request $request)
    {
        $data = $this->reportService->getSalesReport('daily', $request->all());
        return $this->successResponse($data, "Laporan penjualan harian ({$data['period_label']}) berhasil diambil.");
    }

    public function weekly(Request $request)
    {
        $data = $this->reportService->getSalesReport('weekly', $request->all());
        return $this->successResponse($data, "Laporan penjualan mingguan ({$data['period_label']}) berhasil diambil.");
    }

    public function monthly(Request $request)
    {
        $data = $this->reportService->getSalesReport('monthly', $request->all());
        return $this->successResponse($data, "Laporan penjualan bulanan ({$data['period_label']}) berhasil diambil.");
    }

    public function yearly(Request $request)
    {
        $data = $this->reportService->getSalesReport('yearly', $request->all());
        return $this->successResponse($data, "Laporan penjualan tahunan ({$data['period_label']}) berhasil diambil.");
    }
}

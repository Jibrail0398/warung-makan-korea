<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Activity::with('causer')->latest();

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('log_name')) {
            $query->where('log_name', $request->log_name);
        }
        if ($request->filled('causer_id')) {
            $query->where('causer_id', $request->causer_id);
        }

        if ($request->filled('search')) {
            $query->where('description', 'ilike', '%' . $request->search . '%');
        }
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $perPage = (int) $request->input('per_page', 15);
        $logs = $query->paginate($perPage);

        return $this->successResponse(
            ActivityLogResource::collection($logs)->response()->getData(true),
            'Berhasil mengambil daftar log aktivitas'
        );
    }

    public function show(string $id)
    {
        $activity = Activity::with(['causer', 'subject'])->findOrFail($id);

        return $this->successResponse(
            new ActivityLogResource($activity),
            'Detail log aktivitas'
        );
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class BankAccount extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'bank_name',
        'account_number',
        'account_name',
        'is_active',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['bank_name', 'account_number', 'account_name', 'is_active'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}

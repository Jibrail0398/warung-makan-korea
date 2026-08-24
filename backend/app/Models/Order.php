<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Order extends Model
{
    use SoftDeletes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $date = date('Ymd');
                $random = strtoupper(substr(uniqid(), -5));
                $model->id = 'INV-' . $date . '-' . $random;
            }
        });
    }

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_phone',
        'table_number',
        'total_price',
        'status',
        'payment_status',
        'payment_receipt',
        'bank_account_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'payment_status', 'payment_receipt', 'total_price'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}

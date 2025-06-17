<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'invited_user_id',
        'token',
        'status',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function invitedUser()
    {
        return $this->belongsTo(User::class, 'invited_user_id');
    }
}

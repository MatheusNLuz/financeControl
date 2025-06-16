<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['name', 'type'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getBalanceAttribute()
    {
        $receita = $this->transactions()->where('type', 'receita')->sum('amount');
        $despesa = $this->transactions()->where('type', 'despesa')->sum('amount');
        return $receita - $despesa;
    }

}

<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountInvitationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('criar-carteira', [AccountController::class, 'create'])->name('account.create');
    Route::post('criar-carteira/salvar', [AccountController::class, 'store'])->name('account.store');
    Route::delete('apagar/carteira/{id}', [AccountController::class, 'destroy'])->name('account.destroy');

    Route::post('transacao/salvar', [TransactionController::class, 'store'])->name('transaction.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/invites/accept/{token}', [AccountInvitationController::class, 'accept'])->name('invites.accept');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

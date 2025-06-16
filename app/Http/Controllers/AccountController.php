<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function create()
    {
        return Inertia::render('accounts/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:pessoal,compartilhada,investimento',
        ]);

        $account = Account::create($request->only('name', 'type'));

        $request->user()->accounts()->attach($account->id, ['role' => 'dono']);

        return redirect()->route('dashboard')->with('success', 'Conta criada com sucesso!');
    }

    public function edit(Account $account)
    {
        return Inertia::render('accounts/edit', [
            'account' => $account,
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:pessoal,compartilhada,investimento',
        ]);

        $account->update($request->only('name', 'type'));

        return redirect()->route('accounts.index')->with('success', 'Conta atualizada com sucesso!');
    }

    public function destroy(Account $account)
    {
        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Conta excluída com sucesso!');
    }
}

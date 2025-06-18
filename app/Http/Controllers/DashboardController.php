<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index(Request $request)
    {
        try {
            $user = auth()->user();

            $accounts = $user->accounts()->get(['accounts.id', 'accounts.name']);

            if ($accounts->isEmpty()) {
                return Inertia::render('dashboard', [
                    'accounts' => [],
                    'activeAccountId' => null,
                    'summary' => [
                        'entradas' => "0,00",
                        'saidas' => "0,00",
                        'saldo' => "0,00",
                    ],
                    'saldoDiario' => [],
                    'evolucaoMensal' => [],
                    'transactions' => [],
                    'categories' => Category::all(['id', 'name', 'type']),
                ]);
            }

            $activeAccountId = $request->get('account_id') ?? $accounts->first()?->id;

            /** @var Account|null $account */
            $account = $user->accounts()->with('transactions')->find($activeAccountId);

            if (!$account) {
                return to_route('dashboard')->with('error', 'Carteira não encontrada');
            }

            $transactions = $account->transactions()
                ->with('category:id,name,icon', 'user:id,name')
                ->orderByDesc('date')
                ->limit(10)
                ->get(['id', 'description', 'amount', 'type', 'date', 'category_id', 'user_id']);

            $entradas = $account->transactions()->where('type', 'receita')->sum('amount');
            $saidas = $account->transactions()->where('type', 'despesa')->sum('amount');
            $saldo = $entradas - $saidas;

            $saldoDiario = $account->transactions()
                ->selectRaw("DATE(date) as dia, SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) as saldo")
                ->groupByRaw("DATE(date)")
                ->orderBy('dia')
                ->get()
                ->map(fn($item) => [
                    'dia' => date('d/m', strtotime($item->dia)),
                    'saldo' => (float)$item->saldo,
                ]);

            $evolucaoMensal = $account->transactions()
                ->selectRaw("to_char(date, 'Mon') as mes,
                SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END) as entradas,
                SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END) as saidas")
                ->groupByRaw("to_char(date, 'Mon')")
                ->orderByRaw("MIN(date)")
                ->get()
                ->map(fn($item) => [
                    'mes' => $item->mes,
                    'entradas' => (float)$item->entradas,
                    'saidas' => (float)$item->saidas,
                ]);

            return Inertia::render('dashboard', [
                'accounts' => $accounts,
                'activeAccountId' => $account->id,
                'summary' => [
                    'entradas' => number_format($entradas, 2, ',', '.'),
                    'saidas' => number_format($saidas, 2, ',', '.'),
                    'saldo' => number_format($saldo, 2, ',', '.'),
                ],
                'saldoDiario' => $saldoDiario,
                'evolucaoMensal' => $evolucaoMensal,
                'transactions' => $transactions,
                'categories' => Category::all(['id', 'name', 'type']),
                'role' => $account->pivot->role,
                'invitationToken' => session()->get('invitationToken')
            ]);
        } catch (\Exception $exception) {
            return Inertia::render('dashboard');
        }
    }

}

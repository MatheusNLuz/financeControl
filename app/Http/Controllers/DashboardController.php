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
        $user = auth()->user();

        // Carteiras do usuário
        $accounts = $user->accounts()->get(['accounts.id', 'accounts.name']);

        // Seleciona uma carteira (via request ou a primeira)
        $activeAccountId = $request->get('account_id') ?? $accounts->first()?->id;

        /** @var Account|null $account */
        $account = $user->accounts()->with('transactions')->find($activeAccountId);

        if (!$account) {
            return to_route('dashboard')->with('error', 'Carteira não encontrada');
        }

        // Transações
        $transactions = $account->transactions()
            ->orderByDesc('date')
            ->limit(10)
            ->get(['id', 'description', 'amount', 'type', 'date']);

        // Cálculo dos totais
        $entradas = $account->transactions()->where('type', 'receita')->sum('amount');
        $saidas = $account->transactions()->where('type', 'despesa')->sum('amount');
        $saldo = $entradas - $saidas;

        // Exemplo de agrupamento para gráficos
        $saldoDiario = $account->transactions()
            ->selectRaw("DATE(date) as dia, SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) as saldo")
            ->groupByRaw("DATE(date)")
            ->orderBy('dia')
            ->get()
            ->map(fn($item) => ['dia' => date('d/m', strtotime($item->dia)), 'saldo' => (float)$item->saldo]);

        $evolucaoMensal = $account->transactions()
            ->selectRaw("DATE_FORMAT(date, '%b') as mes,
                     SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END) as entradas,
                     SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END) as saidas")
            ->groupByRaw("DATE_FORMAT(date, '%b')")
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
                'entradas' => $entradas,
                'saidas' => $saidas,
                'saldo' => $saldo,
            ],
            'saldoDiario' => $saldoDiario,
            'evolucaoMensal' => $evolucaoMensal,
            'transactions' => $transactions,
            'categories' => Category::all(['id', 'name', 'type']), // 👈 Aqui está a adição
        ]);
    }

}

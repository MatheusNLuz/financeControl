<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->merge([
                'amount' => str_replace(',', '.', $request->input('amount')),
            ]);
            $validated = $request->validate([
                'type' => 'required|in:receita,despesa',
                'amount' => 'required|numeric|min:0.01',
                'description' => 'nullable|string|max:255',
                'date' => 'required|date',
                'category_id' => 'required|exists:categories,id',
                'account_id' => 'required|exists:accounts,id',
            ], [
                'type.required' => 'O tipo da transação é obrigatório.',
                'type.in' => 'O tipo da transação deve ser "receita" ou "despesa".',

                'amount.required' => 'O valor é obrigatório.',
                'amount.numeric' => 'O valor deve ser numérico.',
                'amount.min' => 'O valor deve ser maior que zero.',

                'description.string' => 'A descrição deve ser um texto.',
                'description.max' => 'A descrição deve ter no máximo 255 caracteres.',

                'date.required' => 'A data da transação é obrigatória.',

                'category_id.required' => 'A categoria é obrigatória.',
                'category_id.exists' => 'A categoria selecionada é inválida.',

                'account_id.required' => 'A carteira é obrigatória.',
                'account_id.exists' => 'A carteira selecionada é inválida.',
            ]);

            $validated['user_id'] = auth()->id();

            Transaction::create($validated);

            return redirect()->back()->with('success', 'Nova transação adicionada com sucesso!');
        } catch (ValidationException $exception) {
            return redirect()->back()->withErrors($exception->errors());
        }
    }
}

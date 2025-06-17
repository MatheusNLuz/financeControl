<?php

namespace App\Http\Controllers;

use App\Mail\SharedAccountInvitation;
use App\Models\Account;
use App\Models\AccountInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function create()
    {
        return Inertia::render('accounts/create');
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|in:pessoal,compartilhada,investimento',
                'shared_email' => 'required_if:type,compartilhada|nullable|email|exists:users,email',
                'shared_role' => 'required_if:type,compartilhada|nullable|in:editor,visualizado'
            ], [
                'name.required' => 'O nome da carteira é obrigatório.',
                'name.string' => 'O nome da carteira deve ser um texto.',
                'name.max' => 'O nome da carteira não pode ter mais que 255 caracteres.',

                'type.required' => 'O tipo da carteira é obrigatório.',
                'type.in' => 'O tipo selecionado é inválido. Escolha entre pessoal, compartilhada ou investimento.',

                'shared_email.required_if' => 'Você deve informar um e-mail para compartilhar a carteira.',
                'shared_email.email' => 'Informe um e-mail válido.',
                'shared_email.exists' => 'Não encontramos nenhum usuário com esse e-mail.',

                'shared_role.required_if' => 'Você deve escolher uma permissão para o usuário convidado.',
                'shared_role.in' => 'Permissão inválida. Escolha entre editor ou visualizador.',
            ]);

            $account = Account::create($request->only('name', 'type'));

            $request->user()->accounts()->attach($account->id, ['role' => 'dono']);

            if ($request->type === 'compartilhada' && $request->filled('shared_email')) {
                $sharedUser = User::where('email', $request->shared_email)->first();

                if ($sharedUser->id !== $request->user()->id) {
                    $invitation = AccountInvitation::create([
                        'account_id' => $account->id,
                        'invited_user_id' => $sharedUser->id,
                        'token' => Str::uuid(),
                        'role' => $request->shared_role
                    ]);

                    Mail::to($sharedUser->email)->send(new SharedAccountInvitation($account->name, $invitation->token));
                }
            }

            return redirect()->route('dashboard')->with('success', 'Conta criada com sucesso!');
        } catch (ValidationException $exception) {
            return redirect()->back()->withErrors($exception->errors());
        }
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

    public function destroy($id)
    {
        $user = auth()->user();

        $account = $user->accounts()->where('accounts.id', $id)->first();

        if (!$account) {
            return redirect()->route('dashboard')->with('error', 'Conta não encontrada.');
        }

        if ($account->pivot->role !== 'dono') {
            return redirect()->route('dashboard')->with('error', 'Apenas o dono pode excluir esta carteira.');
        }

        $account->delete();

        return redirect()->route('dashboard')->with('success', 'Conta excluída com sucesso!');
    }
}

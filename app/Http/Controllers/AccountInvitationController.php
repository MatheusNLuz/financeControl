<?php

namespace App\Http\Controllers;

use App\Models\AccountInvitation;

class AccountInvitationController extends Controller
{
    public function accept($token)
    {
        $invitation = AccountInvitation::where('token', $token)->where('status', 'pending')->firstOrFail();

        if (auth()->id() !== $invitation->invited_user_id) {
            abort(403, 'Você não tem permissão para aceitar este convite.');
        }

        $invitation->update(['status' => 'accepted']);

        $invitation->account->users()->attach(auth()->id(), [
            'role' => $invitation->role,
        ]);

        return redirect()->route('dashboard')->with('success', 'Convite aceito com sucesso!');
    }
}

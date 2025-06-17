@extends('email.base')

@section('content')
    <h2>Você foi convidado para acessar a carteira: <strong>{{ $accountName }}</strong></h2>

    <p>Para aceitar o convite, clique no botão abaixo:</p>

    <p style="text-align:center; margin: 30px 0;">
        <a href="{{ route('invites.accept', $token) }}"
           style="background-color:#7B72D0; color:#fff; padding: 12px 25px; border-radius: 5px; text-decoration: none;">
            Aceitar Convite
        </a>
    </p>

    <p>Se você não esperava esse convite, pode ignorar este e-mail.</p>
@endsection

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SharedAccountInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public string $accountName;
    public string $token;

    public function __construct(string $accountName, string $token)
    {
        $this->accountName = $accountName;
        $this->token = $token;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Você foi convidado para uma carteira compartilhada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'email.shared-invitation',
            with: [
                'accountName' => $this->accountName,
                'token' => $this->token,
            ],
        );
    }
}

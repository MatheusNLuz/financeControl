import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PageProps } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'pessoal',
        shared_email: '',
        shared_role: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('account.store'), {
            onFinish: () => reset('name', 'shared_email'),
        });
    };

    const { errors: backendErrors } = usePage<PageProps>().props;

    return (
        <AppLayout>
            <Head title="Criar carteira" />
            <div className="mx-auto w-4/5 p-6">
                {backendErrors && Object.keys(backendErrors).length > 0 && (
                    <Alert variant="error" className="mb-4">
                        <AlertTitle>Erro ao enviar formulário</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(backendErrors).map(([field, messages]) =>
                                    Array.isArray(messages) ? (
                                        messages.map((msg: string, idx: number) => <li key={`${field}-${idx}`}>{msg}</li>)
                                    ) : (
                                        <li key={field}>{messages}</li>
                                    ),
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                <h1 className="mb-4 text-2xl font-bold">Criar Carteira</h1>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome: *</Label>
                            <Input
                                id="name"
                                type="name"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Binance"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo da carteira: *</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pessoal">Pessoal</SelectItem>
                                    <SelectItem value="compartilhada">Compartilhada</SelectItem>
                                    <SelectItem value="investimento">Investimentos</SelectItem>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.type} />
                        </div>

                        {data.type === 'compartilhada' && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="shared_email">E-mail para compartilhar: *</Label>
                                    <Input
                                        id="shared_email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        value={data.shared_email}
                                        onChange={(e) => setData('shared_email', e.target.value)}
                                        tabIndex={3}
                                    />
                                    <InputError message={errors.shared_email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="shared_role">Permissão do convidado: *</Label>
                                    <Select value={data.shared_role} onValueChange={(value) => setData('shared_role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Escolha o nível de acesso" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="visualizador">Visualizador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.shared_role} />
                                </div>
                            </>
                        )}

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Criar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

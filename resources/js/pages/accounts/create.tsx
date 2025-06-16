import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'pessoal',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('account.store'), {
            onFinish: () => reset('name'),
        });
    };

    return (
        <AppLayout>
            <Head title="Criar carteira" />
            <div className="mx-auto w-4/5 p-6">
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

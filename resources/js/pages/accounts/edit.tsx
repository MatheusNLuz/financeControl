import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface Props {
    account: {
        id: number;
        name: string;
        type: string;
    };
}

export default function Edit({ account }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nome: account.name,
        type: account.type,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('accounts.update', account.id));
    };

    return (
        <AppLayout>
            <Head title="Editar carteira" />
            <div className="mx-auto w-4/5 p-6">
                <h1 className="mb-4 text-2xl font-bold">Editar Carteira</h1>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nome">Nome: *</Label>
                            <Input
                                id="nome"
                                type="text"
                                required
                                autoFocus
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                            />
                            <InputError message={errors.nome} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo da carteira: *</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                            >
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

                        <Button type="submit" className="mt-4 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

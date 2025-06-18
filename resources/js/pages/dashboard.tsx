import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { Category, PageProps, Transaction } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import * as LucideIconsRaw from 'lucide-react';
import {
    BanknoteArrowDown,
    BanknoteArrowUp,
    CalendarRange,
    LoaderCircle,
    PlusCircle,
    Trash2,
    TrendingUp,
    WalletCards,
    WalletMinimalIcon
} from 'lucide-react';
import { ElementType, useState } from 'react';
import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export default function Dashboard() {
    const LucideIcons = Object.fromEntries(
        Object.entries(LucideIconsRaw).filter(([, val]) => typeof val === 'function' && 'displayName' in val),
    ) as Record<string, ElementType>;

    const {
        accounts = [],
        role = '',
        activeAccountId,
        summary = { entradas: 0, saidas: 0, saldo: 0 },
        saldoDiario = [],
        evolucaoMensal = [],
        transactions = [],
        categories = [],
    } = usePage<PageProps>().props;

    const {
        data,
        setData,
        post,
        processing,
        reset,
        delete: destroy,
        clearErrors,
    } = useForm({
        amount: '',
        type: '',
        description: '',
        date: '',
        category_id: '',
        account_id: activeAccountId?.toString() || '',
    });

    const saldoConfig: ChartConfig = {
        saldo: {
            label: 'Saldo Diário',
            color: 'var(--purple)',
        },
    };

    const [copied, setCopied] = useState(false);

    const categoriasFiltradas = categories.filter((cat: Category) => cat.type === data.type);

    const mensalConfig: ChartConfig = {
        entradas: {
            label: 'Entradas',
            color: 'var(--chart-1)',
        },
        saidas: {
            label: 'Saídas',
            color: 'var(--chart-2)',
        },
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('transaction.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => closeModal(),
        });
    };

    const handleAccountChange = (value: string) => {
        router.visit(route('dashboard'), {
            data: { account_id: value },
            preserveScroll: true,
        });
    };

    const handleDeleteAccount = (id: number) => {
        destroy(route('account.destroy', id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const { flash, errors: backendErrors } = usePage<PageProps>().props;
    const successMessage = flash?.success;
    const invitationToken = flash?.invitationToken;
    const getInitials = useInitials();
    const { appUrl } = usePage().props;

    const conviteLink = `${appUrl}/invites/accept/${invitationToken}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(conviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Erro ao copiar o link:", err);
        }
    };



    const hasAccounts = accounts.length > 0;
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                {successMessage && (
                    <Alert variant="success" className="mb-4">
                        <AlertTitle>Sucesso!</AlertTitle>
                        <AlertDescription>
                            {successMessage}
                            {invitationToken && (
                                <p className='text-sm'>
                                    Por motivos, os emails não estão sendo enviados. Copie o link e encaminhe para a pessoa desejada: <br />
                                    <code className='block bg-gray-100 px-3 py-2 rounded text-sm break-all'>{conviteLink} <Button size="sm" onClick={handleCopy}>
                                        {copied ? "Link copiado!" : "Copiar link"}
                                    </Button></code>

                                </p>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {!hasAccounts && (
                    <Alert variant="info">
                        <AlertTitle>Nenhuma carteira cadastrada</AlertTitle>
                        <AlertDescription>Adicione uma carteira para começar a registrar transações.</AlertDescription>
                    </Alert>
                )}

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
                <div className="flex items-center justify-between">
                    <Select value={activeAccountId?.toString()} onValueChange={handleAccountChange}>
                        <SelectTrigger className="w-64">
                            <WalletCards className="h-4 w-4 text-muted-foreground" />
                            {accounts.find((acc) => acc.id.toString() === activeAccountId?.toString())?.name || 'Selecione uma carteira'}
                        </SelectTrigger>

                        <SelectContent>
                            {accounts.map((account) => (
                                <div key={account.id} className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-accent">
                                    <SelectItem
                                        value={account.id.toString()}
                                        className="flex-1"
                                        onClick={(e) => {
                                            // se clicar na lixeira, impedir seleção
                                            if ((e.target as HTMLElement).closest('button')) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }
                                        }}
                                    >
                                        {account.name}
                                    </SelectItem>

                                    {role === 'dono' && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    title="Excluir carteira"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deseja apagar a carteira: {account.name}?</DialogTitle>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="secondary">Cancelar</Button>
                                                    </DialogClose>
                                                    <Button onClick={() => handleDeleteAccount(account.id)}>Confirmar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasAccounts && role !== 'visualizador' && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button title="Nova entrada/saída">
                                    <PlusCircle className="h-5 w-5" /> Nova entrada/saída
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Definir entrada ou saída</DialogTitle>
                                </DialogHeader>
                                <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
                                    <div>
                                        <Label>Tipo: *</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={'Tipo da transação'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={'receita'}>Entrada</SelectItem>
                                                <SelectItem value={'despesa'}>Saída</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {data.type && (
                                        <div>
                                            <Label>Categoria: *</Label>
                                            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoriasFiltradas.map((cat: Category) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div>
                                        <Label>Valor (R$): *</Label>
                                        <CurrencyInput
                                            required
                                            id="amount"
                                            name="amount"
                                            placeholder="R$ 00,00"
                                            defaultValue={data.amount}
                                            decimalsLimit={2}
                                            decimalScale={2}
                                            onValueChange={(value) => setData('amount', value || '')}
                                            prefix="R$ "
                                            className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
                                        />
                                    </div>
                                    <div>
                                        <Label>Descrição:</Label>
                                        <Input
                                            type={'text'}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={'Descrição (Opcional)'}
                                        />
                                    </div>
                                    <div>
                                        <Label>Data da transação: *</Label>
                                        <Input
                                            required={true}
                                            type={'date'}
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            placeholder={'DD/MM/AAAA'}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type={'submit'} disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Salvar
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Cards Resumo */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-l-4 border-l-chart-1">
                        <CardHeader>
                            <CardDescription className={'flex items-center gap-2'}>
                                <BanknoteArrowDown /> Entradas
                            </CardDescription>
                            <CardTitle className="text-chart-1">R$ {summary.entradas}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-l-4 border-l-chart-2">
                        <CardHeader>
                            <CardDescription className={'flex items-center gap-2'}>
                                <BanknoteArrowUp /> Saídas
                            </CardDescription>
                            <CardTitle className="text-chart-2">R$ {summary.saidas}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-l-4 border-l-purple">
                        <CardHeader>
                            <CardDescription className={'flex items-center gap-2'}>
                                <WalletMinimalIcon /> Saldo Atual
                            </CardDescription>
                            <CardTitle className="text-purple">R$ {summary.saldo}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Gráficos */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className={'flex items-center gap-2'}>
                                <CalendarRange />
                                Saldo Diário
                            </CardTitle>
                            <CardDescription>Variação de saldo nos últimos dias</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasAccounts && saldoDiario.length > 0 ? (
                                <ChartContainer config={saldoConfig}>
                                    <LineChart data={saldoDiario}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={5} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                        <Line
                                            dataKey="saldo"
                                            type="natural"
                                            fill="var(--color-saldo)"
                                            fillOpacity={0.2}
                                            strokeWidth={2}
                                            stroke="var(--color-saldo)"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            ) : (
                                <p className="text-sm text-gray-500">Nenhum dado disponível</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className={'flex items-center gap-2'}>
                                {' '}
                                <TrendingUp /> Evolução Mensal
                            </CardTitle>
                            <CardDescription>Entradas e saídas por mês</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasAccounts && evolucaoMensal.length > 0 ? (
                                <ChartContainer config={mensalConfig}>
                                    <BarChart data={evolucaoMensal}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={10} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                        <Bar dataKey="entradas" fill="var(--color-entradas)" radius={4} />
                                        <Bar dataKey="saidas" fill="var(--color-saidas)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <p className="text-sm text-gray-500">Nenhum dado disponível</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Últimas Transações */}
                <div className="scrollbar-thin scrollbar-thumb-purple/70 scrollbar-track-gray-100 max-h-80 overflow-y-auto rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900/30">
                    <h3 className="mb-5 text-lg font-semibold text-purple">Últimas transações</h3>

                    {hasAccounts && transactions.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {transactions.map((tx: Transaction) => {
                                const Icon = LucideIcons[tx.category?.icon || 'HelpCircle'];

                                return (
                                    <li
                                        key={tx.id}
                                        className="flex items-center justify-between rounded-md px-3 py-3 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    >
                                        {/* Aqui mostra o usuário com avatar e iniciais */}
                                        <div className="flex gap-12">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage src="#" alt={tx.user.name} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(tx.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center gap-2">
                                                {Icon ? <Icon className="h-5 w-5 text-purple" /> : <span className="inline-block h-5 w-5" />}
                                                <span>{tx.category?.name}</span>
                                            </div>
                                        </div>

                                        <span>{tx.description}</span>

                                        <span className={tx.type === 'receita' ? 'text-chart-1' : 'text-chart-2'}>
                                            {tx.type === 'receita' ? '+ ' : '- '}
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }).format(tx.amount)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Nenhuma transação encontrada</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

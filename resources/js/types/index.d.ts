import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Transaction = {
    id: number;
    description: string;
    amount: number;
    type: 'receita' | 'despesa';
    date: string;
    category: Category
    user: {
        name: string,
        id: number,
    }
};

export type Category = {
    id: number;
    name: string;
    type: 'receita' | 'despesa';
    icon: string
};

export type Account = {
    id: number;
    name: string;
};

export type Summary = {
    entradas: number;
    saidas: number;
    saldo: number;
};

export type SaldoDiarioItem = {
    dia: string;
    saldo: number;
};

export type EvolucaoMensalItem = {
    mes: string; // exemplo: "Jan", "Fev", etc.
    entradas: number;
    saidas: number;
};

export interface PageProps {
    accounts: Account[];
    role: string,
    activeAccountId: number | null;
    summary: Summary;
    saldoDiario: SaldoDiarioItem[];
    evolucaoMensal: EvolucaoMensalItem[];
    transactions: Transaction[];
    categories: Category[];
    [key: string]: any;
}


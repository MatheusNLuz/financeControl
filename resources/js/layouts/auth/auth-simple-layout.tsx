import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    illustrationSrc?: string;
    illustrationAlt?: string;
    illustrationTitle?: string;
    illustrationText?: string;
}

export default function AuthLayout({
                                       children,
                                       title = 'Bem-vindo de volta',
                                       illustrationSrc = '/images/undraw_growth-analytics_bhy7.svg',
                                       illustrationAlt = 'Ilustração',
                                       illustrationTitle = 'Uma experiência moderna para gerenciar suas finanças com liberdade',
                                       illustrationText = 'Gerencie receitas, despesas e conquiste sua liberdade financeira com praticidade e estilo.',
                                   }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937] dark:bg-[#1E1E1E] dark:text-[#E5E7EB]">
            {/* Lado esquerdo ilustrativo */}
            <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#7B72D0]/20 via-[#5DC1B9]/10 to-white p-10 dark:from-[#5B4DB7]/30 dark:via-[#37968C]/20 dark:to-[#121212]">
                <div className="text-center max-w-sm space-y-6">
                    <img
                        src={illustrationSrc}
                        alt={illustrationAlt}
                        className="mx-auto w-full max-w-xs drop-shadow-xl animate-fade-in"
                    />
                    <h2 className="text-xl font-bold text-purple">{illustrationTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{illustrationText}</p>
                </div>
            </div>

            {/* Área do conteúdo */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white shadow-2xl rounded-none md:rounded-l-[2rem] dark:bg-[#1E1E1E] dark:shadow-none">
                <div className="w-full max-w-md space-y-10">
                    {/* Título */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-[#1F2937] dark:text-[#F3F4F6]">{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

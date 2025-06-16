import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { XCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const alertVariants = cva(
    'relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3 gap-y-0.5 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:flex-shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground border border-border dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                success: 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700',
                error: 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700',
                warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700',
                info: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-700',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const iconsMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    default: null,
};

function Alert({ className, variant = 'default', children, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
    // @ts-ignore
    const Icon = iconsMap[variant];

    return (
        <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
            {Icon && <Icon className="text-current" />}
            {children}
        </div>
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="alert-title" className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn('col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed', className)}
            {...props}
        />
    );
}

export { Alert, AlertDescription, AlertTitle };

import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children, title, illustrationSrc, illustrationAlt, illustrationText, illustrationTitle, ...props }: { children: React.ReactNode; title: string; illustrationSrc: string, illustrationAlt: string, illustrationText: string; illustrationTitle: string; }) {
    return (
        <AuthLayoutTemplate title={title} illustrationSrc={illustrationSrc} illustrationAlt={illustrationAlt} illustrationText={illustrationText} illustrationTitle={illustrationTitle} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}

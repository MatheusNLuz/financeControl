import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-11 items-center justify-center">
                <AppLogoIcon />
            </div>
            <div className="-ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Finance Control</span>
            </div>
        </>
    );
}

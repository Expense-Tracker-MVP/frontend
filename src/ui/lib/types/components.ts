export interface GoogleButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

export interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

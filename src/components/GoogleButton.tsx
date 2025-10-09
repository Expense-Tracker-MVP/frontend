"use client"

interface GoogleButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

const GoogleButton = ({ onClick, disabled = false }: GoogleButtonProps) => {
    return (
        <button
            type="button"
            className="w-full bg-white text-black border border-gray-400 rounded-md px-4 py-2 my-2 cursor-pointer flex items-center justify-center gap-2 transition-colors duration-300 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onClick}
            disabled={disabled}
        >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-5 h-5"
            />
            Continue with Google
        </button>
    )
}

export default GoogleButton
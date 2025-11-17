import { Link } from 'react-router'
import ThemeToggle from '@ui/components/ThemeToggle'
import { useAuthStore } from '../lib/store/authStore'

const Navbar = () => {
    const { isAuthenticated } = useAuthStore()
    return (
        <div className="flex gap-1.5 justify-around items-center h-16 px-4 bg-primary" >
            <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/">Home</Link>
            <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/about">About</Link>
            {isAuthenticated ? null : (
                <>
                    <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/sign-in">Sign In</Link>
                    <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/sign-up">Sign Up</Link>
                </>
            )}
            {!isAuthenticated ? null : (
                <>
                    <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/profile">Profile</Link>
                    <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/expenses">Expenses</Link>
                    <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" to="/visuals">Visuals</Link>
                </>
            )}
            <ThemeToggle />
        </div>
    )
}

export default Navbar
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
     <div className="flex gap-1.5 justify-around p-4 bg-[var(--primary)]" >
        <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" href="/sign-in">Sign In</Link>
        <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" href="/sign-up">Sign Up</Link>
        <Link className="text-1.5xl font-bold hover:underline text-gray-600 dark:text-gray-100" href="/profile">Profile</Link>
        <ThemeToggle />
      </div>
  )
}

export default Navbar
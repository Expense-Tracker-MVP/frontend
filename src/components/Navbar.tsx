import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
      <div className="flex gap-1.5 justify-around bg-green-200 p-4">
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Sign Up</Link>
        <Link href="/profile">Profile</Link>
        <ThemeToggle />
      </div>
  )
}

export default Navbar
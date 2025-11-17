import { BrowserRouter, Routes, Route } from 'react-router';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import { AuthGuard } from './components/AuthGuard';
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import Navbar from './components/NavBar';
import AboutPage from './pages/AboutPage';
import VisualsPage from './pages/VisualsPage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <HomePage />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <AboutPage />
            </>
          } />
          <Route path="/sign-in" element={
            <>
              <Navbar />
              <SignInPage />
            </>
          } />
          <Route path="/sign-up" element={
            <>
              <Navbar />
              <SignUpPage />
            </>
          } />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/expenses" element={
            <AuthGuard>
              <Navbar />
              <ExpensesPage />
            </AuthGuard>
          } />
          <Route path="/visuals" element={
            <AuthGuard>
              <Navbar />
              <VisualsPage />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <Navbar />
              <ProfilePage />
            </AuthGuard>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
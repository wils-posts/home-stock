import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'
import LoginView from './views/LoginView'
import DashboardView from './views/DashboardView'
import ShoppingView from './views/ShoppingView'
import BlockedView from './components/BlockedView'

export default function App() {
  const auth = useAuth()
  const { dark, toggleDark } = useDarkMode()

  if (auth.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (auth.status === 'unauthenticated') {
    return <LoginView auth={auth} />
  }

  if (auth.status === 'blocked') {
    return <BlockedView signOut={auth.signOut} />
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardView auth={auth} dark={dark} toggleDark={toggleDark} />} />
      <Route path="/shopping" element={<ShoppingView dark={dark} toggleDark={toggleDark} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

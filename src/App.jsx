import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginView from './views/LoginView'
import DashboardView from './views/DashboardView'
import ShoppingView from './views/ShoppingView'
import BlockedView from './components/BlockedView'

export default function App() {
  const auth = useAuth()

  if (auth.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <Route path="/" element={<DashboardView auth={auth} />} />
      <Route path="/shopping" element={<ShoppingView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

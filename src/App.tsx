import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import BottomBar from './components/BottomBar'
import Toast from './components/Toast'
import Home from './screens/Home'
import Pin from './screens/Pin'
import Thoughts from './screens/Thoughts'
import Trash from './screens/Trash'
import { purgeExpired } from './db/thoughts'
import { useApp } from './store/app'

function Guard() {
  const unlocked = useApp((s) => s.unlocked)
  const loc = useLocation()
  if (!unlocked) return <Navigate to="/pin" state={{ from: loc.pathname }} replace />
  return <Outlet />
}

export default function App() {
  const loc = useLocation()
  const showBar = loc.pathname !== '/pin'

  useEffect(() => {
    useApp.getState().clearToast()
  }, [loc.pathname])

  useEffect(() => {
    purgeExpired()
    const onVis = () => document.visibilityState === 'visible' && purgeExpired()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div className="flex h-full flex-col bg-app">
      <main className="min-h-0 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pin" element={<Pin />} />
          <Route element={<Guard />}>
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showBar && <BottomBar />}
      <Toast />
    </div>
  )
}

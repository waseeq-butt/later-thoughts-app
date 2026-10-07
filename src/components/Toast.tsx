import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store/app'

export default function Toast() {
  const toast = useApp((s) => s.toast)
  const clearToast = useApp((s) => s.clearToast)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 pb-safe">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-auto flex items-center gap-4 rounded-2xl bg-raised px-5 py-3 text-sm shadow-lg"
          >
            <span>{toast.message}</span>
            {toast.actionLabel && (
              <button
                className="min-h-12 px-2 font-semibold text-white"
                onClick={() => {
                  toast.onAction?.()
                  clearToast()
                }}
              >
                {toast.actionLabel}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

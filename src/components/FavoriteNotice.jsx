import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const NOTICE_DURATION = 5

function FavoriteNotice({ notice, targetId, onNavigate, onDismiss }) {
  return (
    <AnimatePresence>
      {notice && (
        <motion.aside
          key={notice.id}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="dark-surface fixed right-4 bottom-4 z-[60] w-[min(20rem,calc(100vw-2rem))] overflow-hidden border border-gold/60 bg-navy-deep p-4 pl-5 text-pina shadow-xl sm:right-6 sm:bottom-6"
        >
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-navy">
            <motion.span
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: NOTICE_DURATION, ease: 'linear' }}
              className="absolute inset-0 origin-left bg-gold"
            />
          </span>
          <a
            href={`#${targetId}`}
            aria-label={`Scroll to Favorites section for ${notice.name}`}
            onClick={(event) => {
              event.preventDefault()
              onNavigate()
            }}
            className="block w-full pr-8 text-left focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
          >
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-tight">
                {notice.action === 'added' ? 'Added to Favorites' : 'Removed from Favorites'}
              </p>
              <p className="mt-1 break-words font-sans text-sm leading-relaxed text-pina/85">
                {notice.action === 'added'
                  ? `${notice.name} is saved to your favorites.`
                  : `${notice.name} was removed from your favorites.`}
              </p>
            </div>
          </a>
          <button
            type="button"
            aria-label="Dismiss favorite notification"
            onClick={onDismiss}
            className="absolute top-2 right-2 grid size-9 place-items-center text-pina/75 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
          >
            <X aria-hidden="true" size={17} strokeWidth={1.5} />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default FavoriteNotice
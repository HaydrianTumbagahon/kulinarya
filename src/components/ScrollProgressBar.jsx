import { motion } from 'framer-motion'

function ScrollProgressBar({ progress }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[100] h-1.5 bg-navy-deep"
    >
      <motion.div
        style={{ scaleX: progress }}
        className="h-full w-full origin-left bg-gold"
      />
    </div>
  )
}

export default ScrollProgressBar

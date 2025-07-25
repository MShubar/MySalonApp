// components/layout/PageTransition.jsx
import { motion } from 'framer-motion';

const transitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={transitionVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ minHeight: '100%', width: '100%' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;

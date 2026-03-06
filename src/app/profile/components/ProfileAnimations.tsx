import {type Variants } from 'framer-motion';

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const articleVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15, mass: 1 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
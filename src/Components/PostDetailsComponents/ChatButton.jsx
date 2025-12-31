import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatButton({ onClick, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={onClick}
          className="hidden lg:flex fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-text-light transition-all z-30 items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-primary border-t border-accent/20 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-secondary">
          © {currentYear} Prithviraj. Built with React, Tailwind & Framer Motion.
        </p>
        <p className="text-secondary/60 mt-2 text-sm">
          All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

export default function Navbar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-primary/90 backdrop-blur-md z-50 border-b border-accent/20"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-accent cursor-pointer"
        >
          &lt;Dev /&gt;
        </motion.h1>

        <div className="flex gap-8">
          {['about', 'projects', 'skills', 'contact'].map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(item)}
              className="text-secondary hover:text-accent transition capitalize font-medium"
            >
              {item}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-accent transition"
          >
            <FaGithub size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-accent transition"
          >
            <FaLinkedin size={20} />
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center pt-20 px-4"
    >
      <div className="text-center max-w-4xl">
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-accent via-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Hi, I'm Prithviraj
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-secondary mb-8"
        >
          Aspiring Software Engineer crafting beautiful & functional web experiences
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg text-secondary/80 mb-12 max-w-2xl mx-auto"
        >
          I'm passionate about building scalable applications with modern technologies. 
          Let's create something amazing together.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-cyan-400 transition"
          >
            View My Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition"
          >
            Get In Touch
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20"
        >
          <FaArrowDown className="mx-auto text-accent text-2xl" />
        </motion.div>
      </div>
    </motion.section>
  );
}

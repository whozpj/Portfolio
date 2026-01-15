import { motion } from 'framer-motion';
import { FaReact, FaNode, FaDatabase, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiNextdotjs } from 'react-icons/si';

export default function Skills() {
  const skills = [
    { icon: FaReact, name: 'React', color: '#61DAFB' },
    { icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    { icon: FaNode, name: 'Node.js', color: '#68A063' },
    { icon: SiTailwindcss, name: 'Tailwind CSS', color: '#06B6D4' },
    { icon: FaDatabase, name: 'Databases', color: '#FF6B6B' },
    { icon: FaGitAlt, name: 'Git', color: '#F1502F' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="skills" className="py-20 px-4 bg-primary/50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-accent"
        >
          Skills & Tech Stack
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {skills.map(({ icon: Icon, name, color }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              whileHover={{ scale: 1.15, rotateZ: 5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="p-6 bg-slate-800/50 rounded-xl border border-accent/30 hover:border-accent transition"
                whileHover={{ boxShadow: `0 0 20px ${color}40` }}
              >
                <Icon size={40} style={{ color }} />
              </motion.div>
              <p className="mt-4 text-secondary font-semibold">{name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

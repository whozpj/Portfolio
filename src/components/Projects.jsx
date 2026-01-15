import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function Projects() {
  const projects = [
    {
      title: 'Project One',
      description: 'A full-stack application built with React, Node.js, and MongoDB. Features real-time updates and responsive design.',
      tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      link: '#',
      github: '#',
      image: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    },
    {
      title: 'Project Two',
      description: 'E-commerce platform with payment integration, product filtering, and admin dashboard. Deployed on production.',
      tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
      link: '#',
      github: '#',
      image: 'bg-gradient-to-br from-purple-500 to-pink-400',
    },
    {
      title: 'Project Three',
      description: 'Collaborative task management tool with real-time notifications, drag-and-drop, and user authentication.',
      tech: ['React', 'Firebase', 'Framer Motion', 'Tailwind'],
      link: '#',
      github: '#',
      image: 'bg-gradient-to-br from-green-500 to-teal-400',
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-accent"
        >
          Featured Projects
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-slate-800/30 border border-accent/20 rounded-xl overflow-hidden hover:border-accent/50 transition"
            >
              <motion.div
                className={`h-40 ${project.image} flex items-center justify-center`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-center">
                  <p className="text-sm opacity-75">Preview</p>
                </div>
              </motion.div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-accent mb-3">{project.title}</h3>
                <p className="text-secondary mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <motion.a
                    href={project.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-cyan-400 transition"
                  >
                    <FaExternalLinkAlt size={14} />
                    Live Demo
                  </motion.a>
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 border border-accent/50 text-accent rounded-lg hover:bg-accent/10 transition"
                  >
                    <FaGithub size={14} />
                    Code
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

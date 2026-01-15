import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent"
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-lg text-secondary leading-relaxed">
              I'm a passionate software engineer with a keen interest in building scalable, 
              user-friendly web applications. My journey in tech started with curiosity about 
              how things work, and it evolved into a passion for creating elegant solutions 
              to complex problems.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              I specialize in full-stack development with modern technologies like React, 
              Node.js, and cloud services. I'm constantly learning and staying updated with 
              the latest industry trends and best practices.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing 
              to open-source projects, or sharing knowledge with the developer community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl p-8 border border-accent/30"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-accent font-bold mb-2">Education</h3>
                <p className="text-secondary">Your University • Computer Science</p>
                <p className="text-secondary/60 text-sm">2020 - 2024</p>
              </div>
              <div>
                <h3 className="text-accent font-bold mb-2">Experience</h3>
                <p className="text-secondary">Internship at Tech Company</p>
                <p className="text-secondary/60 text-sm">2023 - Present</p>
              </div>
              <div>
                <h3 className="text-accent font-bold mb-2">Interests</h3>
                <p className="text-secondary">Web Development • Open Source • Cloud Computing • AI/ML</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

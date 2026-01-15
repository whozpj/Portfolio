import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Contact() {
  const contacts = [
    {
      icon: FaEnvelope,
      text: 'your.email@example.com',
      href: 'mailto:your.email@example.com',
      label: 'Email',
    },
    {
      icon: FaGithub,
      text: 'github.com/yourprofile',
      href: 'https://github.com',
      label: 'GitHub',
    },
    {
      icon: FaLinkedin,
      text: 'linkedin.com/in/yourprofile',
      href: 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: FaTwitter,
      text: '@yourhandle',
      href: 'https://twitter.com',
      label: 'Twitter',
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-primary/50">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-accent"
        >
          Let's Connect
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-secondary text-lg mb-12"
        >
          I'm always open to interesting projects and opportunities. Feel free to reach out!
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contacts.map(({ icon: Icon, text, href, label }, index) => (
            <motion.a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-6 bg-slate-800/30 border border-accent/20 rounded-lg hover:border-accent/50 transition group"
            >
              <Icon className="text-accent text-2xl group-hover:scale-125 transition" />
              <div>
                <p className="text-secondary text-sm">{label}</p>
                <p className="text-white font-semibold">{text}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-accent to-cyan-400 text-primary font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-accent/50 transition"
          >
            Send Me an Email
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-10 md:px-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold"
      >
        Prithvi Raj
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mt-4 text-xl text-gray-400"
      >
        Computer Science @ UVA
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-4 max-w-xl text-gray-500"
      >
        I build scalable backend systems and modern web applications with a
        focus on clean architecture and performance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex gap-4"
      >
        <a
          href="#projects"
          className="px-6 py-3 rounded bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          View Projects
        </a>

        <a
          href="/resume.pdf"
          className="px-6 py-3 rounded border border-gray-600 hover:border-white transition"
        >
          Resume
        </a>
      </motion.div>
    </section>
  );
}

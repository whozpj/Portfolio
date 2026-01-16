"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "experience", "projects", "skills", "interests", "resume", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* Side Navigation - Thinner line, smaller text */}
      <motion.nav
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      >
        <div className="flex flex-col gap-4">
          {[
            { id: "hero", label: "Home" },
            { id: "experience", label: "Experience" },
            { id: "projects", label: "Projects" },
            { id: "skills", label: "Skills" },
            { id: "interests", label: "Interests" },
            { id: "resume", label: "Resume" },
            { id: "contact", label: "Contact" }
          ].map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="group flex items-center gap-3">
              <div className={`h-[1px] transition-all duration-300 ${activeSection === item.id ? "w-8 bg-white" : "w-4 bg-neutral-700 group-hover:w-6"}`} />
              <span className={`text-[10px] uppercase tracking-widest transition-all duration-300 ${activeSection === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Hero Section - Reduced font sizes and image scale */}
      <section id="hero" className="h-[90vh] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900">
            <Image src="/pfp.jpg" alt="Prithvi Raj" width={300} height={300} className="w-full h-full object-cover transition-all duration-700" priority />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-6 max-w-xl text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter">Prithvi Raj</h1>
          <p className="text-lg text-neutral-400 font-light italic">Computer Science @ UVA</p>
          <p className="text-base text-neutral-500 leading-relaxed">
            Solving problems with Software and AI
          </p>
          <div className="flex gap-3 justify-center md:justify-start pt-4">
            <button onClick={() => scrollToSection("projects")} className="px-6 py-2.5 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all">
              Projects
            </button>
            <button onClick={() => scrollToSection("resume")} className="px-6 py-2.5 border border-neutral-800 text-sm font-medium hover:bg-white hover:text-black transition-all">
              Resume
            </button>
          </div>
        </motion.div>
      </section>

{/* Experience Section - 4 Distinct Entries */}
      <section id="experience" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Experience</h2>
        <div className="space-y-12">
          {[
            {
              date: "June 2026 — August 2026",
              role: "Incoming Data Engineering Intern",
              company: "Fannie Mae",
            },
            {
              date: "2024 — Present",
              role: "Software Engineer",
              company: "ManTech",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Migrating a legacy DoD system used across 100+ global locations to modern microservice architectures.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built and maintained four Python Django microservices that exposed GraphQL APIs, while designing a normalized PostgreSQL schema with foreign-key constraints to ensure relational integrity across multi-entity workflows.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Automated vehicle inventory processing by building a production backend ingestion pipeline using a GraphQL API, Google Cloud Vision OCR, and Gemini Flash 1.5 to extract data from over 200 label photos per batch, reducing manual entry time by 90% (from 3 minutes to 20 seconds per label) and eliminating data entry errors.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Developed React/TS interfaces that condensed workflows by 75%, increasing data-entry efficiency by 50%.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Currently architecting a global RAG search pipeline using Llama 3.2 (3B) and Pinecone to enable Natural Language Querying across 1M+ distributed data points.
                  </li>
                </ul>
              ),
            },
            {
              date: "November 2025 — May 2026",
              role: "Software Engineer (Applied Machine Learning)",
              company: "Candlefish",
              desc: "Architected RESTful APIs with FastAPI and implemented JWT-based authentication. Migrated legacy local storage to a containerized Docker environment.",
            },
            {
              date: "May 2024 — August 2024",
              role: "Software Development Intern",
              company: "MyEdMaster",
              desc: "Mentored 50+ students in Data Structures and Algorithms. Conducted code reviews and debugged complex C++ and Java implementations during office hours.",
            }
          ].map((job, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative pl-8 border-l border-neutral-800 hover:border-neutral-500 transition-colors"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-neutral-800 group-hover:bg-white transition-colors" />
              
              <span className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-medium">
                {job.date}
              </span>
              <h3 className="text-xl font-light mt-1 tracking-tight text-neutral-200">
                {job.role}
              </h3>
              <p className="text-neutral-500 text-sm mb-3 italic">
                {job.company}
              </p>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl font-light">
                {job.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section - Two columns, smaller cards */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Selected Projects</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i} className="p-6 bg-neutral-900/50 border border-neutral-900 hover:border-neutral-700 transition-all">
              <h3 className="text-lg font-light mb-2">Distributed Key-Value Store</h3>
              <p className="text-neutral-500 text-sm mb-4 leading-relaxed">
                A high-performance storage engine built for consistency and speed.
              </p>
              <div className="flex gap-2">
                <span className="text-[10px] text-neutral-400 border border-neutral-800 px-2 py-0.5 uppercase">Rust</span>
                <span className="text-[10px] text-neutral-400 border border-neutral-800 px-2 py-0.5 uppercase">gRPC</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills - Smaller radius, tighter text */}
      <section id="skills" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-16 tracking-tight">Skills</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["React", "Node.js", "Python", "TypeScript", "FastAPI", "MongoDB", "Docker", "SQL"].map((skill) => (
            <span key={skill} className="px-4 py-1.5 border border-neutral-800 text-xs text-neutral-400 hover:border-neutral-500 transition-all cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Resume & Contact - Merged into a smaller footer section */}
      <section id="contact" className="py-32 px-6 max-w-4xl mx-auto text-center border-t border-neutral-900">
        <h2 className="text-3xl font-light mb-6 tracking-tight">Get in touch.</h2>
        <p className="text-neutral-500 text-sm mb-10 max-w-md mx-auto">
          Currently looking for 2026 internships. Feel free to reach out for a chat.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-neutral-400">
          <a href="mailto:wyp9mq@virginia.edu" className="hover:text-white transition-colors">Email</a>
          <a href="https://linkedin.com/in/prithvi-raj" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/whozpj" className="hover:text-white transition-colors">GitHub</a>
          <a href="/resume.pdf" className="hover:text-white transition-colors border-b border-neutral-700">Resume</a>
        </div>
      </section>
    </div>
  );
}
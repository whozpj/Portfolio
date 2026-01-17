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
    const sections = ["hero", "experience", "projects", "skills", "contact"];
    
    // 1. Check if the user is truly near the bottom of the page
    // We use a smaller buffer (20px) to ensure we don't jump to Contact too early
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
    
    if (isAtBottom) {
      setActiveSection("contact");
      return;
    }

    // 2. Center-based detection for all other sections
    const current = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        // A section is active if its top is above the middle of the screen
        // and its bottom is below that same middle point.
        const midPoint = window.innerHeight / 2;
        return rect.top <= midPoint && rect.bottom >= midPoint;
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

  const skillCategories = [
    {
      title: "Languages",
      skills: ["Python", "TypeScript", "Java", "JavaScript", "SQL", "R", "Assembly", "C"],
    },
    {
      title: "Frameworks/Libraries",
      skills: ["Django", "FastAPI", "React.js", "GraphQL", "Rest API", "NumPy", "Pandas", "Node.js" ],
    },
    {
      title: "AI/ML",
      skills: ["LangChain", "LangGraph", "PyTorch", "ChromaDB", "RAG Pipelines", "Agentic AI", "GPT-4", "Gemini", "Llama" ],
    },
    {
      title: "Infrastructure & DevOps",
      skills: ["AWS", "GCP", "Azure", "Docker", "PostgreSQL", "CI/CD", "Git/GitHub", "Jira", "Confluence", "VSCode" ],
    },
    {
      title: "Certifications",
      skills: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "MTA Security Fundamentals"],
    },
  ];

  return (
    <div className="bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* Side Navigation */}
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

      {/* Hero Section */}
      {/* Hero Section */}
      <section id="hero" className="min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full">
          {/* Left Side: PFP */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }} 
            className="relative"
          >
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900">
              <Image 
                src="/pfp.jpg" 
                alt="Prithvi Raj" 
                width={300} 
                height={300} 
                className="w-full h-full object-cover object-bottom transition-all duration-700" 
                priority 
              />
            </div>
          </motion.div>

          {/* Right Side: Title & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }} 
            className="space-y-6 max-w-xl text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter">Prithvi Raj</h1>
            <p className="text-lg text-neutral-400 font-light italic">Computer Science @ UVA</p>
            <p className="text-base text-neutral-500 leading-relaxed max-w-md">
              Solving complex problems with Software and Artificial Intelligence.
            </p>
            <div className="flex gap-3 justify-center md:justify-start pt-4">
              <button onClick={() => scrollToSection("projects")} className="px-6 py-2.5 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all">
                Projects
              </button>
              <button onClick={() => scrollToSection("contact")} className="px-6 py-2.5 border border-neutral-800 text-sm font-medium hover:bg-white hover:text-black transition-all">
                Contact
              </button>
            </div>
          </motion.div>
        </div>

        {/* Integrated About Me Paragraph (Underneath Hero Content) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-3xl text-center md:text-left border-t border-neutral-900 pt-12"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-neutral-600 mt-1">Background</h2>
            <div className="md:col-span-2 space-y-6 text-neutral-400 font-light leading-relaxed">
              <p>
                Hello! I'm Prithvi, a Software Engineer with a passion for solving problems through AI and software. Currently, I am a Software Engineer at ManTech, focusing on modernizing legacy systems and implementing AI-driven solutions. I am also actively involved with Candlefish, where I apply machine learning techniques to real-world challenges.
              </p>
              <p>
                In my free time, I enjoy hitting the gym, hanging out with friends, exploring new technologies, and learning. I'm always eager to connect with like-minded individuals, so feel free to reach out! I am actively seeking internship opportunities for Summer and Fall 2026.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Experience</h2>
        <div className="space-y-12">
          {[
            {
              date: "June 2026 — August 2026",
              role: "Incoming Data Engineering Intern",
              company: "Fannie Mae",
              desc: null
            },
            {
              date: "2024 — Present",
              role: "Software Engineer",
              company: "ManTech",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                   <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Migrating a legacy DoD system used at 100+ locations worldwide to a modern microservices architecture using Django, React, GCP, PostgreSQL, and AI.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Architected a global RAG search pipeline using quantized Llama 3.2 (3B) and Pinecone to enable natural language querying across distributed databases, transforming unstructured logs into actionable insights while ensuring low-latency data privacy.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built 4 Django microservices with GraphQL/PostgreSQL and an AI pipeline (OCR + Gemini Flash) reducing inventory processing time by 90% (3m to 20s).
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Developed React/TS interfaces that condensed workflows by 75%, increasing data-entry efficiency by 50%.
                  </li>
                </ul>
              ),
            },
            {
              date: "November 2025 — Present",
              role: "Software Engineer (Applied ML)",
              company: "Candlefish",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Designed a scalable data synthesis engine generating 10K structured inputs with geometric constraints, eliminating a 200+ hour operational bottleneck.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Engineered a PyTorch U-Net pipeline with mixed-precision training, achieving 0.89 mIoU with 18ms inference latency.
                  </li>
                </ul>
              ),
            },

            {
            date: "May 2024 — August 2024",
            role: "Software Development Intern",
            company: "MyEdMaster",
            desc: (
              <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                <li className="flex gap-2">
                  <span className="text-neutral-700">—</span>
                  Building an AI-powered educational platform using GPT-4 and LangChain to provide personalized AI tutoring agents for K-12 students, resulting in a 30% increase in engagement metrics during the beta phase.
                </li>
                <li className="flex gap-2">
                  <span className="text-neutral-700">—</span>
                  Architected a RAG system using LangChain and GPT-4 to handle 20,000+ dynamic educational documents, providing real-time system context while avoiding the high latency and cost of model fine-tuning.
                </li>
                <li className="flex gap-2">
                  <span className="text-neutral-700">—</span>
                  Developed an automated ETL pipeline using Selenium and BeautifulSoup to transform unstructured data into structured JSON, integrating ChromaDB to eliminate hallucinations, achieving 22 ms inference times.
                </li>
              </ul>
            ),
          }
          ].map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="group relative pl-8 border-l border-neutral-800 hover:border-neutral-500 transition-colors">
              <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-neutral-800 group-hover:bg-white transition-colors" />
              <span className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-medium">{job.date}</span>
              <h3 className="text-xl font-light mt-1 tracking-tight text-neutral-200">{job.role}</h3>
              <p className="text-neutral-500 text-sm mb-3 italic">{job.company}</p>
              <div className="text-neutral-500 text-sm leading-relaxed max-w-2xl font-light">{job.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-light mb-12 tracking-tight">Selected Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "FeatherDB",
              desc: "A lightweight, file-based relational database engine built from the ground up in Java. FeatherDB implements a custom SQL-like query language with a complete parser, query optimizer, and execution engine, using the file system for persistent data storage.",
              tags: ["Java", "Maven", "JUnit"],
            },
            {
              title: "Cloud Computing Project",
              desc: "End to end project I do during Cloud Computing course where I built a serverless web application that scales automatically based on user demand using AWS Lambda, API Gateway, and DynamoDB.",
              tags: ["AWS"],
            },
            {
              title: "SWE Project",
              desc: "Full stack project in SWE course in Django team of 4",
              tags: ["Django", "PostgreSQL", "Docker"],
            },
            { 
              title: "CV Project",
              desc: "Computer Vision project that classifies images from CIFAR-10 dataset using a custom CNN built in PyTorch, achieving 75% accuracy through data augmentation and hyperparameter tuning.",
              tags: ["TypeScript", "Next.js", "Kafka", "PostgreSQL"],
            },
            {
              title: "AI Project",
              desc: "Full AI Project that builds an end-to-end RAG pipeline using LangChain, GPT-4, and Pinecone to enable semantic search over large document corpora with low-latency responses.",
              tags: ["TypeScript", "Next.js", "Kafka", "PostgreSQL"],
            },
            {
              title: "ML Project",
              desc: "MLB Tracker",
              tags: ["TypeScript", "Next.js", "Kafka", "PostgreSQL"],
            }
          ].map((project, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.2)" }}
              className="p-8 bg-neutral-900/40 border border-neutral-900 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-light mb-3 uppercase tracking-wider text-neutral-200">
                  {project.title}
                </h3>
                <p className="text-neutral-500 text-sm mb-6 leading-relaxed font-light">
                  {project.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[9px] text-neutral-500 border border-neutral-800 px-2 py-0.5 uppercase tracking-tighter"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 max-w-5xl mx-auto"> {/* Increased max-width to 5xl */}
  <h2 className="text-4xl font-light mb-20 tracking-tight text-center">Technical Expertise</h2> {/* Text-3xl to 4xl */}
  
  <div className="space-y-16"> {/* Increased vertical gap between categories */}
    {skillCategories.map((category) => (
      <div key={category.title} className="space-y-6"> {/* Increased gap between title and tags */}
        <h3 className="text-[12px] uppercase tracking-[0.4em] text-neutral-500 text-center font-medium">
          {category.title}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-3"> {/* Slightly wider gap between tags */}
          {category.skills.map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ 
                scale: 1.08, // Slightly more pronounced scale
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.4)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-6 py-2 border border-neutral-800 bg-neutral-950 text-[13px] text-neutral-400 cursor-default transition-colors tracking-wide"
              // Increased padding and font-size from 11px to 13px
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Footer */}
      <section id="contact" className="py-32 px-6 max-w-4xl mx-auto text-center border-t border-neutral-900">
        <h2 className="text-3xl font-light mb-6 tracking-tight">Get in touch.</h2>
        <p className="text-neutral-500 text-sm mb-10 max-w-md mx-auto font-light leading-relaxed">Currently looking for 2026 internships. Feel free to reach out for a chat.</p>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-neutral-500">
          <a href="mailto:wyp9mq@virginia.edu" className="hover:text-white transition-colors">Email</a>
          <a href="https://linkedin.com/in/prithvi-raj" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/whozpj" className="hover:text-white transition-colors">GitHub</a>
          <a href="/resume.pdf" className="hover:text-white transition-colors border-b border-neutral-700">Resume</a>
        </div>
      </section>
    </div>
  );
}
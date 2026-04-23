"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import CursorGlow from "./CursorGlow";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProject, setSelectedProject] = useState<null | any>(null);
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

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedProject]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const skillCategories = [
    {
      title: "Languages",
      skills: ["Python", "Java", "TypeScript", "JavaScript", "Go", "SQL"],
    },
    {
      title: "Frameworks/Libraries",
      skills: ["FastAPI", "Django", "React.js", "GraphQL", "RESTful APIs", "PostgreSQL", "Gradle", "JUnit", "Pytest"],
    },
    {
      title: "AI/ML",
      skills: ["LangChain", "LangGraph", "PyTorch", "ChromaDB", "NumPy", "Pandas", "RAG Pipelines", "Agentic AI", "Gemini", "GPT-4"],
    },
    {
      title: "Cloud & Infrastructure",
      skills: ["AWS (RDS, EC2, ECS, S3, ALB)", "GCP", "Kubernetes", "Docker", "Terraform", "Heroku"],
    },
    {
      title: "Developer Tools",
      skills: ["Claude Code", "GitHub", "VSCode"],
    },
    {
      title: "Certifications",
      skills: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "MTA Security Fundamentals"],
    },
  ];

  return (
    <div className="bg-neutral-950 text-white selection:bg-white selection:text-black lg:pr-96">
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
                Hello! I&apos;m Prithvi, a Software Engineer focused on applied AI and backend systems. I&apos;m currently at Candlefish — Machine Learning @UVA, shipping a PyTorch U-Net segmentation model. Before that, I spent a year at ManTech modernizing a legacy DoD platform into Django microservices on Google Kubernetes Engine. This summer I&apos;ll be joining Fannie Mae as a Software Engineering Intern, followed by IBM in Austin for the fall.
              </p>
              <p>
                I study Computer Science at the University of Virginia (B.S. expected May 2028, GPA 3.84). In my free time, I enjoy the gym, hanging out with friends, exploring new tools, and building things like the galaxy portfolio you&apos;re looking at. Always happy to connect — feel free to reach out.
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
              date: "Aug 2026 — Dec 2026",
              role: "Software Development Intern · Incoming",
              company: "IBM · Austin, TX",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>Incoming August 2026.
                  </li>
                </ul>
              ),
            },
            {
              date: "Jun 2026 — Aug 2026",
              role: "Software Engineering Intern · Incoming",
              company: "Fannie Mae · Reston, VA",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>Incoming June 2026.
                  </li>
                </ul>
              ),
            },
            {
              date: "Nov 2025 — May 2026",
              role: "Software Engineer (Applied ML)",
              company: "Candlefish — Machine Learning @UVA",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Designed a data synthesis engine that auto-generated 10K architectural blueprints with labeled structural elements, eliminating a 200+ hour manual labeling bottleneck.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built a PyTorch U-Net segmentation model achieving 0.89 mean IoU across 6 blueprint classes with 18ms inference time.
                  </li>
                </ul>
              ),
            },
            {
              date: "May 2025 — April 2026",
              role: "Software Development Intern",
              company: "ManTech · Herndon, VA",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built 4 Django microservices deployed on Google Kubernetes Engine, serving 1,000+ DoD users across 100+ worldwide locations with resilient, monitored services.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built an AI query system using LangGraph and Gemini Flash that translates natural language into complex database searches, reducing query time from 90 seconds to 20 seconds.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Created an AI pipeline using OCR and Gemini to process 200+ vehicle label images per batch, cutting data-entry time from 2+ hours to 10 minutes.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Developed 5 React interfaces that streamlined workflows from 8 steps to 4, improving data-entry efficiency by 50%.
                  </li>
                </ul>
              ),
            },
            {
              date: "May 2024 — Aug 2024",
              role: "Software Development Intern",
              company: "MyEdMaster",
              desc: (
                <ul className="space-y-2 mt-3 text-sm text-neutral-500 font-light">
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Built a personalized AI tutoring system using LangChain, GPT-4, and ChromaDB that adapts to individual student learning styles for AP Calculus and algebra.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-700">—</span>
                    Created an automated pipeline using Selenium and BeautifulSoup to extract and structure educational content from web sources for AI-powered tutoring.
                  </li>
                </ul>
              ),
            },
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
              title: "Argus",
              desc: "A SaaS platform that detects statistically significant LLM performance regressions across model versions, giving teams automated confidence scores before production deploys.",
              tags: ["Python", "Go", "Next.js", "FastAPI", "PostgreSQL", "AWS", "Terraform"],
              github: "https://github.com/whozpj",
              howItWorks: "A Python SDK (published to PyPI) wraps LLM calls and streams evaluation traces to the Argus backend. A Go evaluation service scores each run, while a FastAPI analytics service applies Mann-Whitney U tests to compare the current version's distribution against historical baselines, flagging regressions at 98% accuracy.",
              design: "Full-stack cloud architecture on AWS: Terraform-provisioned ECS Fargate for containerized services, RDS PostgreSQL for persistence, an Application Load Balancer fronting the API, and CloudFront + S3 serving the Next.js dashboard. The SDK, Go evaluator, and Python analytics service are independently deployable.",
              challenges: "Choosing a non-parametric statistical test (Mann-Whitney U) was critical — LLM score distributions are rarely normal, so Student's t-tests produce false positives. Calibrating the regression threshold across varied evaluation suites required synthetic benchmarking before launch.",
            },
            {
              title: "FeatherDB",
              desc: "A lightweight, file-based relational database engine built from the ground up in Java, with a custom SQL-like query language, recursive descent parser, and B-tree-indexed storage.",
              tags: ["Java", "Gradle", "JUnit"],
              github: "https://github.com/whozpj/featherdb",
              howItWorks: "A recursive descent parser converts SQL-like input into an abstract syntax tree, which a polymorphic command dispatcher routes across 8 operations (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, and more). Data is persisted in a custom file format and indexed with B-trees for O(log n) lookups.",
              design: "Layered architecture: Parser → Command Dispatcher (polymorphic per operation) → Execution Engine → Storage Layer. Each table lives in its own file; B-tree indices are memory-resident and periodically flushed. 104 JUnit tests exercise the engine across 1K–100K-row datasets to validate correctness and performance.",
              challenges: "Implementing a recursive descent parser that handled precedence, nesting, and error recovery cleanly was the hardest piece. Maintaining O(log n) guarantees under inserts and deletes required careful B-tree rebalancing. Writing 104 tests forced meticulous boundary-condition reasoning across dataset sizes.",
            },
          ].map((project, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.2)" }}
              onClick={() => setSelectedProject(project)}
              className="group p-8 bg-neutral-900/40 border border-neutral-900 transition-all flex flex-col justify-between cursor-pointer relative"
            >
              {/* Arrow indicator */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-5px] translate-y-[5px] group-hover:translate-x-0 group-hover:translate-y-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M5 15L15 5M15 5H5M15 5V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
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
      {/* What I'm Working On Section */}
      <section id="working-on" className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light mb-8 tracking-tight">What I'm Working On</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Galaxy Portfolio (this site)",
              desc: "An interactive WebGL portfolio rendering my work as a navigable galaxy — stars for each section, orbiting planets for roles, projects, and skills, with Playwright-verified scroll choreography.",
              tags: ["Next.js", "React Three Fiber", "TypeScript", "Tailwind"],
              status: "In Progress",
            },
            {
              title: "Live Streaming Platform",
              desc: "A scalable video streaming service that handles real-time video ingestion, transcoding to multiple qualities, and content delivery with live chat and viewer analytics.",
              tags: ["Python (FastAPI)", "FFmpeg", "Redis", "PostgreSQL", "WebSockets", "Docker"],
              status: "In Progress",
            },
          ].map((work, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.2)" }}
              className="group p-8 bg-neutral-900/40 border border-neutral-900 transition-all flex flex-col justify-between cursor-pointer relative"
            >
              <div>
                <h3 className="text-lg font-light mb-3 uppercase tracking-wider text-neutral-200">
                  {work.title}
                </h3>
                <p className="text-neutral-500 text-sm mb-6 leading-relaxed font-light">
                  {work.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {work.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[9px] text-neutral-500 border border-neutral-800 px-2 py-0.5 uppercase tracking-tighter"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-400 italic">{work.status}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section id="contact" className="py-32 px-6 max-w-4xl mx-auto text-center border-t border-neutral-900">
        <h2 className="text-3xl font-light mb-6 tracking-tight">Get in touch.</h2>
        <p className="text-neutral-500 text-sm mb-10 max-w-md mx-auto font-light leading-relaxed">Currently looking for 2026 summer/fall internships. Feel free to reach out for a chat.</p>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-neutral-500">
          <a href="mailto:wyp9mq@virginia.edu" className="hover:text-white transition-colors">Email</a>
          <a href="https://www.linkedin.com/in/prithvi-raj-7015a0250/" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/whozpj" className="hover:text-white transition-colors">GitHub</a>
          <a href="/resume.pdf" className="hover:text-white transition-colors border-b border-neutral-700">Resume</a>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 md:px-6"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ y: 30, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.95, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 relative shadow-2xl scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent hover:scrollbar-thumb-neutral-700"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#404040 transparent'
            }}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:rotate-90"
            >
              <span className="text-xl leading-none">×</span>
            </motion.button>

            <div className="p-8 md:p-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h3 className="text-3xl md:text-4xl font-light mb-4 tracking-tight text-neutral-100">
                  {selectedProject.title}
                </h3>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-light">
                  {selectedProject.desc}
                </p>
              </motion.div>

              {/* Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="flex flex-wrap gap-4 md:gap-6 mb-12 pb-8 border-b border-neutral-800"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-all duration-300"
                >
                  GitHub
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 text-xs uppercase tracking-widest font-medium hover:border-neutral-500 hover:text-white transition-all duration-300"
                >
                  How it works
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#design"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('design')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 text-xs uppercase tracking-widest font-medium hover:border-neutral-500 hover:text-white transition-all duration-300"
                >
                  Design
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#challenges"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 text-xs uppercase tracking-widest font-medium hover:border-neutral-500 hover:text-white transition-all duration-300"
                >
                  Challenges
                </motion.a>
              </motion.div>

              {/* Content Sections */}
              <div className="space-y-12">
                <motion.section
                  id="how-it-works"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-neutral-800 to-transparent group-hover:w-12 transition-all duration-300" />
                    <h4 className="text-neutral-200 uppercase tracking-[0.3em] text-xs font-medium">
                      How it works
                    </h4>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800 group-hover:from-transparent group-hover:to-neutral-700 transition-all duration-300" />
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light pl-11">
                    {selectedProject.howItWorks}
                  </p>
                </motion.section>

                <motion.section
                  id="design"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-neutral-800 to-transparent group-hover:w-12 transition-all duration-300" />
                    <h4 className="text-neutral-200 uppercase tracking-[0.3em] text-xs font-medium">
                      Design
                    </h4>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800 group-hover:from-transparent group-hover:to-neutral-700 transition-all duration-300" />
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light pl-11">
                    {selectedProject.design}
                  </p>
                </motion.section>

                <motion.section
                  id="challenges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-neutral-800 to-transparent group-hover:w-12 transition-all duration-300" />
                    <h4 className="text-neutral-200 uppercase tracking-[0.3em] text-xs font-medium">
                      Challenges
                    </h4>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800 group-hover:from-transparent group-hover:to-neutral-700 transition-all duration-300" />
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light pl-11">
                    {selectedProject.challenges}
                  </p>
                </motion.section>
              </div>
            </div>
          </motion.div>
      </motion.div>
      )}

      {/* ChatBot */}
      <ChatBot />

      {/* Cursor Glow */}
      <CursorGlow />
    </div>
  );
}

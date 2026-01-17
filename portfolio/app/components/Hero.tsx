"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";

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
              github: "https://github.com/whozpj/featherdb",
              howItWorks: "FeatherDB is built with a custom SQL parser that processes queries into an abstract syntax tree. The query optimizer analyzes the execution plan and selects the most efficient path. Data is stored in a custom file format with B-tree indexing for fast lookups. The execution engine processes SELECT, INSERT, UPDATE, and DELETE operations with transaction support.",
              design: "The architecture follows a layered design pattern: Parser Layer → Optimizer → Execution Engine → Storage Layer. Each layer is modular and testable. The file system acts as the persistent storage, with each table stored as a separate file. Indexes are maintained in memory and periodically flushed to disk.",
              challenges: "Implementing a robust query parser that handles complex SQL syntax was challenging. Ensuring data consistency during concurrent operations required careful transaction management. Optimizing query performance without a traditional database cache required innovative indexing strategies.",
            },
            {
              title: "Cloud Computing Project",
              desc: "End to end project I do during Cloud Computing course where I built a serverless web application that scales automatically based on user demand using AWS Lambda, API Gateway, and DynamoDB.",
              tags: ["AWS"],
              github: "https://github.com/whozpj/cloud-project",
              howItWorks: "The application uses AWS Lambda functions triggered by API Gateway to handle HTTP requests. DynamoDB stores user data with automatic scaling. CloudWatch monitors performance and triggers auto-scaling. The entire infrastructure is defined as code using AWS SAM.",
              design: "Serverless architecture with API Gateway as the entry point, Lambda functions for business logic, and DynamoDB for data persistence. S3 hosts static assets. CloudFront provides CDN capabilities for global distribution.",
              challenges: "Managing cold starts in Lambda functions required optimization. DynamoDB partition key design was critical for performance. Implementing proper error handling and retry logic across distributed services was complex.",
            },
            {
              title: "SWE Project",
              desc: "Full stack project in SWE course in Django team of 4",
              tags: ["Django", "PostgreSQL", "Docker"],
              github: "https://github.com/whozpj/swe-project",
              howItWorks: "Built a full-stack web application using Django REST Framework for the backend API and React for the frontend. PostgreSQL handles data persistence with proper normalization. Docker containers ensure consistent deployment across environments.",
              design: "MVC architecture with Django models, views, and templates. RESTful API design with proper HTTP methods. Frontend communicates with backend through JSON APIs. Docker Compose orchestrates multi-container deployment.",
              challenges: "Coordinating with a team of 4 required clear communication and version control practices. Integrating frontend and backend APIs required careful API design. Database migrations and schema changes needed careful planning.",
            },
            { 
              title: "CV Project",
              desc: "Computer Vision project that classifies images from CIFAR-10 dataset using a custom CNN built in PyTorch, achieving 75% accuracy through data augmentation and hyperparameter tuning.",
              tags: ["PyTorch", "Python", "Computer Vision"],
              github: "https://github.com/whozpj/cv-project",
              howItWorks: "A custom Convolutional Neural Network (CNN) architecture processes 32x32 RGB images. The model uses convolutional layers for feature extraction, pooling layers for dimensionality reduction, and fully connected layers for classification. Data augmentation techniques like rotation, flipping, and color jittering improve generalization.",
              design: "CNN architecture with 3 convolutional blocks, each followed by batch normalization and ReLU activation. Max pooling reduces spatial dimensions. Dropout layers prevent overfitting. The model is trained using Adam optimizer with learning rate scheduling.",
              challenges: "Achieving good accuracy on CIFAR-10 required careful hyperparameter tuning. Overfitting was a major challenge, solved through data augmentation and dropout. Training time optimization required GPU acceleration and batch size tuning.",
            },
            {
              title: "AI Project",
              desc: "Full AI Project that builds an end-to-end RAG pipeline using LangChain, GPT-4, and Pinecone to enable semantic search over large document corpora with low-latency responses.",
              tags: ["LangChain", "GPT-4", "Pinecone", "Python"],
              github: "https://github.com/whozpj/ai-project",
              howItWorks: "Documents are chunked and embedded using OpenAI's embedding model. Embeddings are stored in Pinecone vector database. User queries are embedded and used to search for similar document chunks. Relevant chunks are passed to GPT-4 as context for generating answers. LangChain orchestrates the entire pipeline.",
              design: "RAG (Retrieval-Augmented Generation) architecture with document ingestion pipeline, vector store (Pinecone), and LLM integration (GPT-4). The system supports multiple document formats and includes query preprocessing and post-processing.",
              challenges: "Chunking documents optimally to preserve context was challenging. Balancing retrieval accuracy with latency required careful vector search tuning. Managing API costs while maintaining quality required efficient prompt engineering and caching strategies.",
            },
            {
              title: "ML Project",
              desc: "MLB Tracker",
              tags: ["Python", "Machine Learning", "Data Analysis"],
              github: "https://github.com/whozpj/ml-project",
              howItWorks: "A machine learning application that tracks and analyzes MLB statistics. Data is scraped from public APIs, processed, and used to train predictive models. The system provides insights on player performance and game predictions.",
              design: "Data pipeline architecture with ETL processes, feature engineering, model training, and prediction serving. The system uses scikit-learn for traditional ML models and provides REST APIs for predictions.",
              challenges: "Handling missing data and outliers in sports statistics required robust preprocessing. Feature engineering to capture meaningful patterns was time-consuming. Model interpretability was important for explaining predictions to users.",
            }
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
    </div>
  );
}
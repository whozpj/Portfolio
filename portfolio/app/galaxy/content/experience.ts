import type { System } from "./types";

export const experienceSystem: System = {
  id: "experience",
  index: 1,
  title: "Experience",
  subtitle: "3 roles · current",
  accent: "violet",
  accentHex: "#c4b5fd",
  planets: [
    {
      id: "mantech",
      kind: "experience",
      label: "ManTech",
      orbit: "inner",
      role: "Software Development Intern",
      company: "ManTech",
      dateRange: "May 2025 — April 2026",
      status: "active",
      bullets: [
        "Built **4 prod Django microservices** with **GraphQL APIs on GKE**, serving 1,000+ DoD users with automated failover.",
        "Engineered an **agentic query builder** using **LangGraph** that translates natural language into complex database searches, reducing query construction time from 90s to 20s.",
        "Architected an **automated pipeline** using **Google Cloud Vision** and **Gemini 2.5 Flash** to read and extract data from 200+ vehicle label images per run, cutting manual data entry by ~90%.",
        "Reduced data-entry steps by 50% by building **5 React components** with **centralized state management**.",
      ],
    },
    {
      id: "candlefish",
      kind: "experience",
      label: "Candlefish",
      orbit: "mid",
      role: "Machine Learning Intern",
      company: "Candlefish — Machine Learning @UVA",
      dateRange: "Nov 2025 — May 2026",
      status: "active",
      bullets: [
        "Eliminated 200+ hour manual labeling bottleneck by designing a **scalable data synthesis engine** that auto-generated **10K architectural blueprints** with multi-class labels.",
        "Achieved **0.89 mean IoU** across 6 classes by engineering a **PyTorch UNet segmentation pipeline** with dice loss training.",
      ],
    },
    {
      id: "myedmaster",
      kind: "experience",
      label: "MyEdMaster",
      orbit: "outer",
      role: "Software Development Intern",
      company: "MyEdMaster LLC",
      dateRange: "May 2024 — Aug 2024",
      status: "past",
      bullets: [
        "Reduced hallucinations and maintained 52ms inference latency by architecting a **RAG pipeline** over **20K+ educational snippets**, choosing **vector search over fine-tuning** to support real-time content updates.",
        "Cut ~15 hours of manual data prep by engineering an **ETL pipeline** with **Selenium and BeautifulSoup** to scrape and transform 750 pages of unstructured web content into **ChromaDB-indexed JSON**.",
      ],
    },
  ],
};

import type { System } from "./types";

export const skillsSystem: System = {
  id: "skills",
  index: 3,
  title: "Skills",
  subtitle: "5 clusters",
  accent: "cyan",
  accentHex: "#67e8f9",
  planets: [
    { id: "lang", kind: "skillCluster", label: "Languages", orbit: "inner", title: "Languages", items: ["Python", "TypeScript", "Java", "JavaScript", "SQL", "R", "Assembly", "C"] },
    { id: "frame", kind: "skillCluster", label: "Frameworks", orbit: "inner", title: "Frameworks & Libraries", items: ["Django", "FastAPI", "React.js", "GraphQL", "REST API", "NumPy", "Pandas", "Node.js"] },
    { id: "ai", kind: "skillCluster", label: "AI / ML", orbit: "mid", title: "AI / ML", items: ["LangChain", "LangGraph", "PyTorch", "ChromaDB", "RAG Pipelines", "Agentic AI", "GPT-4", "Gemini", "Llama"] },
    { id: "infra", kind: "skillCluster", label: "Infrastructure", orbit: "mid", title: "Infrastructure & DevOps", items: ["AWS", "GCP", "Azure", "Docker", "PostgreSQL", "CI/CD", "Git/GitHub", "Jira", "Confluence", "VSCode"] },
    { id: "certs", kind: "skillCluster", label: "Certifications", orbit: "outer", title: "Certifications", items: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "MTA Security Fundamentals"] },
  ],
};

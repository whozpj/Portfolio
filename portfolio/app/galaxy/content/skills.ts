import type { System } from "./types";

export const skillsSystem: System = {
  id: "skills",
  index: 3,
  title: "Skills",
  subtitle: "6 clusters",
  accent: "cyan",
  accentHex: "#67e8f9",
  planets: [
    { id: "lang", kind: "skillCluster", label: "Languages", orbit: "inner", title: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "Go", "SQL"] },
    { id: "frame", kind: "skillCluster", label: "Frameworks", orbit: "inner", title: "Frameworks & Libraries", items: ["FastAPI", "Django", "React.js", "GraphQL", "RESTful APIs", "PostgreSQL", "Gradle", "JUnit", "Pytest"] },
    { id: "ai", kind: "skillCluster", label: "AI / ML", orbit: "mid", title: "AI / ML", items: ["LangChain", "LangGraph", "PyTorch", "ChromaDB", "NumPy", "Pandas", "RAG Pipelines", "Agentic AI", "Gemini", "GPT-4"] },
    { id: "infra", kind: "skillCluster", label: "Cloud & Infra", orbit: "mid", title: "Cloud & Infrastructure", items: ["AWS (RDS, EC2, ECS, S3, ALB)", "GCP", "Kubernetes", "Docker", "Terraform", "Heroku"] },
    { id: "tools", kind: "skillCluster", label: "Dev Tools", orbit: "outer", title: "Developer Tools", items: ["Claude Code", "GitHub", "VSCode"] },
    { id: "certs", kind: "skillCluster", label: "Certifications", orbit: "outer", title: "Certifications", items: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "MTA Security Fundamentals"] },
  ],
};

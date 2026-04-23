import type { System } from "./types";

export const projectsSystem: System = {
  id: "projects",
  index: 2,
  title: "Projects",
  subtitle: "2 systems · built from scratch",
  accent: "amber",
  accentHex: "#fbbf24",
  planets: [
    {
      id: "argus",
      kind: "project",
      label: "Argus",
      orbit: "inner",
      name: "Argus",
      description: "A SaaS platform that detects statistically significant LLM performance regressions across model versions, providing teams with automated confidence scores before production deploys.",
      tags: ["Python", "Go", "Next.js", "FastAPI", "PostgreSQL", "AWS", "Terraform"],
      howItWorks: "A Python SDK (published to PyPI) wraps LLM calls and streams evaluation traces to the Argus backend. A Go evaluation service scores each run, while a FastAPI analytics service applies Mann-Whitney U tests to compare the current version's distribution against historical baselines, flagging regressions at 98% accuracy.",
      design: "Full-stack cloud architecture on AWS: Terraform-provisioned ECS Fargate for containerized services, RDS PostgreSQL for persistence, an Application Load Balancer fronting the API, and CloudFront + S3 serving the Next.js dashboard. The SDK, Go evaluator, and Python analytics service are independently deployable.",
      challenges: "Choosing a non-parametric statistical test (Mann-Whitney U) was critical — LLM score distributions are rarely normal, so Student's t-tests produce false positives. Calibrating the regression threshold across varied evaluation suites required synthetic benchmarking before launch.",
    },
    {
      id: "featherdb",
      kind: "project",
      label: "FeatherDB",
      orbit: "mid",
      name: "FeatherDB",
      description: "A lightweight, file-based relational database engine built from the ground up in Java, with a custom SQL-like query language, recursive descent parser, and B-tree-indexed storage.",
      tags: ["Java", "Gradle", "JUnit"],
      github: "https://github.com/whozpj/featherdb",
      howItWorks: "A recursive descent parser converts SQL-like input into an abstract syntax tree, which a polymorphic command dispatcher routes across 8 operations (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, and more). Data is persisted in a custom file format and indexed with B-trees for O(log n) lookups.",
      design: "Layered architecture: Parser → Command Dispatcher (polymorphic per operation) → Execution Engine → Storage Layer. Each table lives in its own file; B-tree indices are memory-resident and periodically flushed. 104 JUnit tests exercise the engine across 1K–100K-row datasets to validate correctness and performance.",
      challenges: "Implementing a recursive descent parser that handled precedence, nesting, and error recovery cleanly was the hardest piece. Maintaining O(log n) guarantees under inserts and deletes required careful B-tree rebalancing. Writing 104 tests forced meticulous boundary-condition reasoning across dataset sizes.",
    },
  ],
};

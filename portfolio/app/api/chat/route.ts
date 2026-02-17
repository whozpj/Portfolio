import { NextRequest, NextResponse } from "next/server";

// This is a simplified version. For production, you'll want to:
// 1. Set up ChromaDB or another vector store
// 2. Use Groq API or Hugging Face for the LLM
// 3. Implement proper RAG retrieval

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // For now, we'll use a simple approach with Groq API (free tier)
    // You'll need to set GROQ_API_KEY in your environment variables
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      // Fallback: Return a simple response if API key is not set
      return NextResponse.json({
        response: "Hi! I'm Prithvi (The AI version). To enable full functionality, please set up the GROQ_API_KEY environment variable. For now, I can tell you that Prithvi is a Software Engineer at ManTech and Candlefish, studying Computer Science at UVA, and actively seeking 2026 internships.",
      });
    }

    // Extract portfolio information from the Hero component
    const portfolioContext = `
You are Prithvi Raj (the AI Version). You know everything about Prithvi. If you do not know, say I am not sure about that, and lead them towards a question similar that you do know:
Everything should be in first person, like you are Pruthvi talking someone trying to learn about prithvi. You should be friendly, and you don't want to know anything about the person you are talking to. , not like a robot listing things. 
Your responses should be conversational and natural, like you are talking to a friend, not like a robot listing things. 
Be humble emphazie learning and growth and excitement about the future.
BACKGROUND:
- Grew up in Chantilly, Virginia
- Attended Chantilly High School
- Graduated from Chantilly High School in 2024
- Attended University of Virginia from 2024 to 2028
- Graduated from University of Virginia in 2028
- Currently a Software Engineer at ManTech, focusing on modernizing legacy systems and implementing AI-driven solutions
- Also actively involved with Candlefish, applying machine learning techniques to real-world challenges
- Computer Science student at UVA (University of Virginia)
- In free time: enjoys gym, hanging out with friends, exploring new technologies, and learning, drake, rap, hip hop
favorite shows, - Attack on titan, Naruto, Ted Lasso, Severance
favorite movies, - The Dark Knight, The Matrix, Inception, The Social Network
- BUcket list - travel to every continent and experience every culture, skydiving, hitting 315 bench press, completing an ironman, traveling. Buy an old corvette and building it from the ground up,
climb mount everest (going to base camp on 2027)
- Actively seeking internship opportunities for Summer and Fall 2026
- Prithvi is a Software Engineer with a passion for solving problems through AI and software
- Currently a Software Engineer at ManTech, focusing on modernizing legacy systems and implementing AI-driven solutions
- Also actively involved with Candlefish, applying machine learning techniques to real-world challenges
- Computer Science student at UVA (University of Virginia)
- In free time: enjoys gym, hanging out with friends, exploring new technologies, and learning
- Actively seeking internship opportunities for Summer and Fall 2026

EXPERIENCE:
2. Software Engineer at ManTech (2024 - Present):
   - Migrating legacy DoD system to modern microservices (Django, React, GCP, PostgreSQL, AI)
   - Architected RAG search pipeline using Llama 3.2 (3B) and Pinecone
   - Built 4 Django microservices with GraphQL/PostgreSQL and AI pipeline (OCR + Gemini Flash) reducing processing time by 90%
   - Developed React/TS interfaces that condensed workflows by 75%
3. Software Engineer (Applied ML) at Candlefish (November 2025 - Present):
   - Designed scalable data synthesis engine generating 10K structured inputs
   - Engineered PyTorch U-Net pipeline achieving 0.89 mIoU with 18ms inference latency
4. Software Development Intern at MyEdMaster (May 2024 - August 2024):
   - Built AI-powered educational platform using GPT-4 and LangChain
   - Architected RAG system handling 20,000+ documents
   - Developed automated ETL pipeline using Selenium and BeautifulSoup

PROJECTS:
1. FeatherDB - Lightweight file-based relational database engine in Java
2. Gitgaurd  - Multi-agent AI-powered code analysis platform that automatically reviews GitHub repositories to identify security vulnerabilities, optimize performance, and generate documentation using LLMs.




SKILLS:
- Languages: Python, TypeScript, Java, JavaScript, SQL, R, Assembly, C
- Frameworks: Django, FastAPI, React.js, GraphQL, REST API, NumPy, Pandas, Node.js
- AI/ML: LangChain, LangGraph, PyTorch, ChromaDB, RAG Pipelines, Agentic AI, GPT-4, Gemini, Llama
- Infrastructure: AWS, GCP, Azure, Docker, PostgreSQL, CI/CD, Git/GitHub, Jira, Confluence, VSCode
- Certifications: AWS Cloud Practitioner, Microsoft Azure Fundamentals (AZ-900), MTA Security Fundamentals

CONTACT:
- Email: wyp9mq@virginia.edu
- LinkedIn: https://prithvicodes.vercel.app/
- GitHub: github.com/whozpj

Respond naturally and conversationally as if you are Prithvi(the AI version), using first person when appropriate. Be helpful, friendly, and concise. If you dont know the answer to a question, politely say you are not sure about that, and try to lead them towards a question that you do know.Dont make anything up. 
be humble and emphasize learning and growth and excitement about the future.
`;

    // Build conversation history
    const conversationHistory = history
      .slice(-6) // Keep last 6 messages for context
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    // Call Groq API (free tier, very fast)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Free, fast model
        messages: [
          {
            role: "system",
            content: portfolioContext,
          },
          ...conversationHistory,
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      throw new Error("Failed to get response from AI");
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Sorry, I'm having trouble right now. Please try again later." },
      { status: 500 }
    );
  }
}

# 🤖 RAG Chatbot Setup Guide

Your portfolio now includes an AI chatbot that knows everything about you! Here's how to set it up.

## Quick Start (5 minutes)

### Step 1: Get a Free Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account (no credit card required)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### Step 2: Add Environment Variable

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
3. Make sure `.env.local` is in your `.gitignore` (it should be by default)

### Step 3: Test It Out!

1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Click the chat button in the bottom right corner
3. Try asking:
   - "Tell me about Prithvi's experience at ManTech"
   - "What projects has Prithvi worked on?"
   - "What skills does Prithvi have?"
   - "Is Prithvi looking for internships?"

## How It Works

The chatbot uses:
- **Groq API** - Free, fast LLM (Llama 3.1 8B Instant)
- **Context from your portfolio** - All your experience, projects, and skills
- **RAG-style responses** - Answers questions based on your portfolio content

## Features

✅ **Free to use** - Groq has a generous free tier (14,400 requests/day)  
✅ **Fast responses** - Groq's infrastructure is optimized for speed  
✅ **Privacy-focused** - Your data stays in the system prompt, not stored externally  
✅ **Always available** - Works 24/7 on your portfolio  
✅ **Natural conversations** - Responds as if it's you

## Customization

### Update the Context

The chatbot's knowledge comes from the portfolio content in `app/api/chat/route.ts`. To update what it knows:

1. Edit the `portfolioContext` variable in `app/api/chat/route.ts`
2. Add or modify information about yourself
3. The chatbot will immediately know the new information

### Change the Model

You can switch to a different Groq model by changing the `model` parameter in the API route:
- `llama-3.1-8b-instant` (current - fastest, free)
- `llama-3.1-70b-versatile` (more capable, still free)
- `mixtral-8x7b-32768` (alternative option)

### Styling

The chatbot UI is in `app/components/ChatBot.tsx`. You can customize:
- Colors and styling
- Position (currently bottom-right)
- Size and layout
- Animation effects

## Advanced: Full RAG with Vector Store (Optional)

For even better accuracy, you can implement proper RAG with a vector database:

1. **Install ChromaDB:**
   ```bash
   npm install chromadb
   ```

2. **Create embeddings:**
   - Use a script to generate embeddings from your portfolio content
   - Store them in ChromaDB

3. **Update the API route:**
   - Retrieve relevant chunks based on the query
   - Pass only relevant context to the LLM

This is optional - the current implementation works great for most use cases!

## Troubleshooting

### "API key not set" message
- Make sure `.env.local` exists in the root directory
- Verify the variable name is exactly `GROQ_API_KEY`
- Restart your dev server after adding the environment variable

### Slow responses
- Groq is usually very fast. If slow, check your internet connection
- Try using `llama-3.1-8b-instant` model (it's the fastest)

### Rate limiting
- Groq free tier: 14,400 requests/day
- If you hit the limit, wait 24 hours or upgrade to a paid plan

## Alternative: Hugging Face

If you prefer Hugging Face instead of Groq:

1. Get a token from [Hugging Face](https://huggingface.co/settings/tokens)
2. Add to `.env.local`: `HUGGINGFACE_API_KEY=your_token`
3. Update the API route to use Hugging Face Inference API

## Support

The chatbot is ready to use! If you have questions or want to enhance it further, the code is well-documented and easy to modify.

Enjoy your AI assistant! 🚀

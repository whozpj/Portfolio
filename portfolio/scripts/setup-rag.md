# Setting Up Your RAG Chatbot

This guide will help you set up a free RAG chatbot that knows everything about you.

## Option 1: Groq API (Recommended - Free & Fast)

1. **Get a free Groq API key:**
   - Go to https://console.groq.com/
   - Sign up for a free account
   - Create an API key
   - Copy the API key

2. **Add to environment variables:**
   - Create a `.env.local` file in the root directory
   - Add: `GROQ_API_KEY=your_api_key_here`

3. **That's it!** The chatbot will work immediately.

## Option 2: Enhanced RAG with Vector Store (Optional)

For better accuracy, you can set up ChromaDB:

1. **Install ChromaDB:**
   ```bash
   npm install chromadb
   ```

2. **Create embeddings script:**
   - Run the `generate-embeddings.ts` script to create vector embeddings
   - This will store your portfolio content in a vector database

3. **Update the API route:**
   - Modify `app/api/chat/route.ts` to use ChromaDB for retrieval
   - This will make responses more accurate by retrieving relevant context

## Option 3: Hugging Face (Alternative Free Option)

If you prefer Hugging Face:

1. **Get Hugging Face token:**
   - Go to https://huggingface.co/settings/tokens
   - Create a free token

2. **Update `.env.local`:**
   ```
   HUGGINGFACE_API_KEY=your_token_here
   ```

3. **Modify the API route** to use Hugging Face Inference API instead of Groq.

## Testing

1. Start your dev server: `npm run dev`
2. Click the chat button in the bottom right
3. Ask questions like:
   - "Tell me about Prithvi's experience"
   - "What projects has Prithvi worked on?"
   - "What skills does Prithvi have?"
   - "Is Prithvi looking for internships?"

## Notes

- Groq API has a generous free tier (14,400 requests/day)
- The current implementation uses the portfolio content directly in the system prompt
- For production, consider implementing proper RAG with vector retrieval for better accuracy
- All data stays private - no personal information is stored externally

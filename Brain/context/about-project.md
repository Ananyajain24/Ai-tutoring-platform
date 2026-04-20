# About Project

## Product Name
AI Vedic Maths Tutor (Cuemath-style system)

## Product Description
An AI-native tutoring platform that teaches Vedic Mathematics to students using structured, step-by-step explanations powered by RAG and LLM. The system is designed around the "Brain + Context + Agents + Tools" architecture.

## Core Features

### 1. Step-by-Step Teaching
The tutor breaks down every problem into atomic steps using Vedic Maths sutras. Each step is typed (show, highlight, calculate, cross, multiply, combine) and rendered sequentially on the whiteboard.

### 2. RAG-Based Explanations
Explanations are grounded in the Vedic Maths knowledge base (`/Brain/knowledge/vedic-maths.md`). The RAG engine retrieves the most relevant sutra or technique before generating a response.

### 3. Practice + Evaluation
Students receive generated practice questions by topic and difficulty. Evaluation (correctness checking) is done by backend code — NOT by the LLM.

### 4. Personalization
Student preferences (learning style, interests, past performance) are stored in `user-preferences.md` and injected into the system prompt to personalize explanations.

### 5. Whiteboard Visualization
A canvas-based whiteboard renders each step of the solution as an animation. Steps are driven by the structured JSON output from the backend — not by the LLM directly.

### 6. Voice Explanation
Each step's `explanation` field is read aloud via text-to-speech, allowing students to listen while watching the whiteboard animation.

## Target User
School students (ages 8–16) learning mental maths and Vedic calculation techniques.

## System Architecture
```
User Input
  → API (Express)
    → Agent (prompt + RAG context)
      → LLM (Claude/OpenAI)
        → Structured JSON
          → Backend (validate + evaluate)
            → Frontend (animate whiteboard + voice)
```

## Tech Stack
- **Backend**: Node.js, Express
- **LLM**: Claude (claude-sonnet-4-6) via Anthropic SDK
- **RAG**: Vector embeddings + similarity search (Supabase pgvector)
- **Frontend**: React, Canvas API / Konva.js for whiteboard
- **Voice**: Web Speech API or AWS Polly

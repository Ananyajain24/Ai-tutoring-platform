# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-Automation-Platform-for-SMB: a Node.js/Express backend for an AI-powered business support system combining RAG (Retrieval Augmented Generation), conversation memory management, voice interaction via Twilio, and usage tracking. No frontend exists yet.

## Commands

```bash
# Development (hot reload)
cd backend && npm run dev

# Production
cd backend && npm start

# Background ingestion worker (must run alongside server)
cd backend && npm run worker
```

No lint or test scripts are configured.

## Architecture

The backend lives entirely in `backend/src/`. It requires both the Express server and the BullMQ worker running simultaneously for full functionality.

### Layers

**Routes → Services → Supabase/OpenAI**

- `routes/` — Express route handlers for: `business`, `document`, `chat`, `search`, `voice`, `usage`
- `services/` — Business logic: retrieval, memory, document, business, storage, usage
- `workers/ingestion.worker.js` — BullMQ worker for async PDF processing
- `config/redis.js` — Redis connection (localhost:6379) used by BullMQ
- `db/supabase.js` — Supabase client (PostgreSQL + pgvector)
- `middleware/` — JWT auth (Supabase JWKS), rate limiting (3 req/min), Multer upload (10MB)
- `schemas/` — Zod validation for chat and search requests

### Document Ingestion Pipeline

```
POST /document (PDF) → Multer saves locally → queue job in BullMQ
  → Worker: pdfjs-dist extracts text → chunk (700 chars, 100 overlap)
  → OpenAI text-embedding-3-small → insert into document_chunks (pgvector)
  → Delete temp file, mark document "completed"
```

### Chat Flow (RAG + Memory)

```
POST /chat → verify JWT → embed query → pgvector similarity search (top 3 chunks)
  → fetch conversation summary + last 6 messages
  → build prompt (summary + history + RAG context) → OpenAI gpt-4o-mini
  → save response → summarize if >8 messages in conversation
  → return response + source documents
```

### Voice Flow

```
Twilio call → gather speech → RAG search → LLM → AWS Polly TTS → loop
```

### Database (Supabase)

Key tables: `businesses`, `documents`, `document_chunks` (vectors), `conversations`, `messages`, `usage_logs`

Vector search uses the `match_document_chunks` RPC function (pgvector).

All data is isolated by `business_id`. Users belong to businesses.

### Key Design Decisions

- Conversation memory: conversations with >8 messages are auto-summarized to reduce token usage while preserving context (`memory.service.js`)
- Usage tracking: tokens and embeddings are tracked per business in `usage_logs` for monitoring/billing
- ES modules throughout (`"type": "module"` in package.json)
- LLM models: `gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings

## Environment

Required `.env` variables: OpenAI API key, Supabase URL + anon/service keys, database URL, Redis URL, Twilio credentials.

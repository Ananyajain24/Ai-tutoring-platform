# User Preferences

This file stores student-level preferences that are injected into agent prompts to personalize explanations.

## Schema
Each student entry follows this structure:

```json
{
  "student_id": "string",
  "name": "string",
  "preferences": {
    "interests": ["string"],
    "explanation_style": "visual | verbal | example-first | rule-first",
    "difficulty_level": "beginner | intermediate | advanced",
    "language": "string"
  },
  "performance": {
    "strong_topics": ["string"],
    "weak_topics": ["string"],
    "last_score": number
  }
}
```

## Default Student Profile (used for development/testing)

```json
{
  "student_id": "default",
  "name": "Student",
  "preferences": {
    "interests": ["cricket"],
    "explanation_style": "visual",
    "difficulty_level": "beginner",
    "language": "English"
  },
  "performance": {
    "strong_topics": [],
    "weak_topics": [],
    "last_score": null
  }
}
```

## Personalization Rules

- If `interests` includes "cricket" → use cricket score examples when introducing a new concept.
- If `explanation_style` is "visual" → always include a `whiteboard` step type in the response.
- If `difficulty_level` is "beginner" → break steps into smaller atomic operations; avoid sutra names without explanation.
- If `weak_topics` includes the current topic → prepend a short recap step before the main solution.

## How This File Is Used

The `promptTemplates.js` module reads the active student's preferences and injects them into the system prompt sent to the LLM, so every response is tailored without changing agent logic.

# Swipe Internship Assignment — AI-Powered Interview Assistant

**Made by Aryan**

## Project Overview

This is a crisp React/Next.js app for an AI-powered interview assistant.  
It provides two tabs: **Interviewee (chat)** and **Interviewer (dashboard)**, both kept in sync.

---

### Interviewee (Chat)

- Upload resume (PDF required, DOCX optional).
- Extract Name, Email, Phone from resume.
- If any field is missing, chatbot collects it before starting.
- Timed interview: AI generates questions and judges answers.
- 6 questions: 2 Easy (20s), 2 Medium (60s), 2 Hard (120s).
- Auto-submit when timer runs out.
- Final score and AI summary after interview.

### Interviewer (Dashboard)

- List of candidates ordered by score.
- View each candidate's chat history, profile, and final AI summary.
- Search and sort candidates.
- Detailed view: all questions, answers, and AI scores.

### Persistence

- All data (timers, answers, progress) is saved locally.
- Closing/reopening restores progress.
- "Welcome Back" modal for unfinished sessions.

### Tech Stack

- React + Redux Toolkit (with persistence)
- Next.js
- shadcn/ui (modern UI library)
- Google Generative AI (for questions & scoring)
- Friendly error handling (invalid files, missing fields)

---

## Assignment Checklist

- [x] Resume upload (PDF/DOCX)
- [x] Extract Name, Email, Phone
- [x] Chatbot prompts for missing fields
- [x] Timed interview (AI questions, auto-submit)
- [x] 6 questions (2 Easy, 2 Medium, 2 Hard)
- [x] Final score and summary
- [x] Interviewee tab (chat flow)
- [x] Interviewer tab (dashboard, search/sort, details)
- [x] Data persistence (local restore, welcome back modal)
- [x] Responsive UI, error handling

---

## Attribution

Made by Aryan for Swipe Internship Assignment.

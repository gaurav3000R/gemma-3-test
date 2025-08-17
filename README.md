# LLM Test Project

This project is a simple chat application with a Next.js frontend and a Python backend.

## Prerequisites

- Node.js (v18 or later)
- pnpm
- Python (3.10 or later)
- uv

## Setup

### Backend

1. Navigate to the backend directory:

   ```bash
   cd gemma-backend
   ```
2. Create a virtual environment and install dependencies from `pyproject.toml`:

   ```bash
   uv venv
   uv pip install -e .
   ```

### Frontend & Running the Application

1. Navigate to the frontend directory:

   ```bash
   cd gemma-frontend
   ```
2. Install dependencies:

   ```bash
   pnpm install
   ```
3. Run the development server for both frontend and backend:

   ```bash
   pnpm dev
   ```

This single command will start the Next.js frontend and the Python backend concurrently. The application should now be running on [http://localhost:3000](http://localhost:3000)

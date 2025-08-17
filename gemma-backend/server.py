from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, StoppingCriteria, StoppingCriteriaList
import torch
import re
import time
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from collections import defaultdict

app = FastAPI()

# ------------------ CORS ------------------
origins = ["http://localhost:3000"]  # Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Model ------------------
model_name = "google/gemma-3-270m-it"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype="auto"
)
model.eval()

# ------------------ Memory ------------------
chat_memories: Dict[str, Dict[str, List[Dict[str, str]]]] = defaultdict(lambda: defaultdict(list))

MAX_MEMORY_TURNS = 8   # keep only last 8 exchanges
MAX_CONTEXT_TOKENS = 1024  # truncate if too long

def build_prompt(new_user_message: str, memory: List[Dict[str, str]]) -> str:
    """Builds the conversation history into a prompt"""

    # Truncate memory if too long
    if len(memory) > MAX_MEMORY_TURNS:
        memory.pop(0)

    # Construct history
    history = ""
    for turn in memory:
        history += f"User: {turn['user']}\nAssistant: {turn['assistant']}\n"

    # Add current user query
    prompt = f"""You are a helpful assistant. 
Answer the user's request clearly and concisely.

{history}
User: {new_user_message}
Assistant:"""
    return prompt.strip()

# ------------------ Stopping Criteria ------------------
class StopOnUser(StoppingCriteria):
    """Stop generation if model starts writing 'User:' again."""
    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        text = tokenizer.decode(input_ids[0], skip_special_tokens=True)
        return "User:" in text[-20:]

# ------------------ API ------------------
class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str
    max_new_tokens: int = 200
    temperature: float = 0.7
    top_p: float = 0.9
    repetition_penalty: float = 1.1

@app.post("/chat")
def chat(req: ChatRequest):
    start = time.time()

    # Get this user's session memory
    memory = chat_memories[req.user_id][req.session_id]

    # Build the prompt
    prompt = build_prompt(req.message, memory)

    # Tokenize
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=MAX_CONTEXT_TOKENS).to(model.device)

    # Generate
    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            max_new_tokens=req.max_new_tokens,
            temperature=req.temperature,
            top_p=req.top_p,
            repetition_penalty=req.repetition_penalty,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            stopping_criteria=StoppingCriteriaList([StopOnUser()]),
        )

    reply = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract assistant reply
    match = re.search(r"Assistant:(.*)", reply, re.DOTALL)
    if match:
        reply = match.group(1).strip()

    # Save turn in memory
    memory.append({"user": req.message, "assistant": reply})

    elapsed = round(time.time() - start, 2)

    return {
        "response": reply,
        "history": memory,
        "params": {
            "max_new_tokens": req.max_new_tokens,
            "temperature": req.temperature,
            "top_p": req.top_p,
            "repetition_penalty": req.repetition_penalty,
        },
        "latency_sec": elapsed,
        "meta": {
            "model": model_name,
            "device": str(model.device),
            "dtype": str(model.dtype),
        }
    }

# ------------------ NEW API: Get chats ------------------

@app.get("/get_chats/{user_id}")
def get_user_chats(user_id: str):
    """Get all chat sessions for a specific user"""
    if user_id not in chat_memories:
        return {"user_id": user_id, "sessions": {}}
    return {"user_id": user_id, "sessions": chat_memories[user_id]}

@app.get("/get_all_chats")
def get_all_chats():
    """Get all chats for all users (admin/debug)"""
    return {"all_users": chat_memories}

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# CORS middleware setup.
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model_name = "google/gemma-3-270m-it"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype="auto"
)

class ChatRequest(BaseModel):
    message: str
    max_new_tokens: int = 200
    temperature: float = 0.7
    top_p: float = 0.9
    repetition_penalty: float = 1.1

@app.post("/chat")
def chat(req: ChatRequest):
    prompt = f"User: {req.message}\nAssistant:"
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=req.max_new_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
        repetition_penalty=req.repetition_penalty,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

    reply = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Clean up the response to remove the prompt
    response_start = reply.find("Assistant:")
    if response_start != -1:
        reply = reply[response_start + len("Assistant:"):
].strip()
    return {"response": reply}

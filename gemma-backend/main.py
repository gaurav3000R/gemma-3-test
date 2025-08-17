from transformers import AutoTokenizer, AutoModelForCausalLM

model_name = "google/gemma-3-270m-it"

print("Loading model...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype="auto",
)

print("Generating...")
inputs = tokenizer("what is your name ?", return_tensors="pt").to(model.device)
outputs = model.generate(
    **inputs,
    max_new_tokens=200,   # 🔹 length of generation
    temperature=0.7,      # 🔹 randomness (0.0 = deterministic, >1 = more random)
    top_p=0.9,            # 🔹 nucleus sampling (controls diversity)
    top_k=50,             # 🔹 limits sampling to top-k tokens
    repetition_penalty=1.1, # 🔹 discourage repeating phrases
    do_sample=True,       # 🔹 enable sampling (instead of greedy)
    pad_token_id=tokenizer.eos_token_id
)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))

export const hyperparamPresets = [
    {
        key: "concise_answer",
        label: "Concise Answer",
        description: "Gives short and direct factual responses.",
        params: {
            max_new_tokens: 100,
            temperature: 0.2,
            top_p: 0.9,
            repetition_penalty: 1.05,
        },
    },
    {
        key: "detailed_explanation",
        label: "Detailed Explanation",
        description: "Provides longer, well-structured explanations with details.",
        params: {
            max_new_tokens: 300,
            temperature: 0.5,
            top_p: 0.95,
            repetition_penalty: 1.05,
        },
    },
    {
        key: "creative_writing",
        label: "Creative Writing",
        description: "Generates stories, poems, and imaginative text.",
        params: {
            max_new_tokens: 400,
            temperature: 1.0,
            top_p: 0.95,
            repetition_penalty: 1.0,
        },
    },
    {
        key: "brainstorming",
        label: "Brainstorming",
        description: "Suggests multiple ideas, options, or approaches.",
        params: {
            max_new_tokens: 250,
            temperature: 0.9,
            top_p: 1.0,
            repetition_penalty: 1.05,
        },
    },
    {
        key: "summarization",
        label: "Summarization",
        description: "Condenses long text into short and clear summaries.",
        params: {
            max_new_tokens: 120,
            temperature: 0.3,
            top_p: 0.85,
            repetition_penalty: 1.1,
        },
    },
    {
        key: "translation",
        label: "Translation",
        description: "Translates text between languages with high accuracy.",
        params: {
            max_new_tokens: 200,
            temperature: 0.4,
            top_p: 0.9,
            repetition_penalty: 1.0,
        },
    },
    {
        key: "code_generation",
        label: "Code Generation",
        description: "Writes code snippets or fixes programming errors.",
        params: {
            max_new_tokens: 250,
            temperature: 0.3,
            top_p: 0.85,
            repetition_penalty: 1.1,
        },
    },
    {
        key: "step_by_step_reasoning",
        label: "Step-by-Step Reasoning",
        description: "Solves math, logic, or technical problems step by step.",
        params: {
            max_new_tokens: 300,
            temperature: 0.4,
            top_p: 0.9,
            repetition_penalty: 1.05,
        },
    },
    {
        key: "storytelling",
        label: "Storytelling",
        description: "Writes long narrative stories with creativity.",
        params: {
            max_new_tokens: 500,
            temperature: 1.1,
            top_p: 0.98,
            repetition_penalty: 1.0,
        },
    },
    {
        key: "bullet_points",
        label: "Bullet Points",
        description: "Structures answers as lists or outlines.",
        params: {
            max_new_tokens: 150,
            temperature: 0.4,
            top_p: 0.85,
            repetition_penalty: 1.1,
        },
    },
    {
        key: "qa_factual",
        label: "Strict Q&A",
        description: "Answers with only factual information, no creativity.",
        params: {
            max_new_tokens: 120,
            temperature: 0.2,
            top_p: 0.8,
            repetition_penalty: 1.1,
        },
    },
    {
        key: "chatty_casual",
        label: "Chatty & Casual",
        description: "Acts like a friendly chatbot with informal responses.",
        params: {
            max_new_tokens: 250,
            temperature: 0.8,
            top_p: 0.95,
            repetition_penalty: 1.0,
        },
    },
];

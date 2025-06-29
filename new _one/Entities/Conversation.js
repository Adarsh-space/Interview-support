const Conversation = {
    name: "Conversation",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the conversation"
        },
        session_id: {
            type: "string",
            description: "Reference to the interview session"
        },
        question: {
            type: "string",
            description: "The interviewer's question"
        },
        ai_suggestion: {
            type: "string",
            description: "AI-generated response suggestion"
        },
        user_response: {
            type: "string",
            description: "Final response given by the user"
        },
        timestamp: {
            type: "string",
            format: "date-time",
            description: "When this conversation occurred"
        },
        confidence_score: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "AI confidence in the suggestion"
        },
        response_time: {
            type: "number",
            description: "Time taken to respond in seconds"
        },
        tags: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Tags for categorizing the question"
        },
        difficulty_level: {
            type: "string",
            enum: ["easy", "medium", "hard"],
            description: "Perceived difficulty of the question"
        },
        support_intervention: {
            type: "boolean",
            default: false,
            description: "Whether support intervened in this response"
        },
        support_notes: {
            type: "string",
            description: "Notes from support team"
        }
    },
    required: [
        "session_id",
        "question"
    ]
};

export default Conversation; 
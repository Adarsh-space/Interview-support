const SupportSession = {
    name: "SupportSession",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the support session"
        },
        interview_session_id: {
            type: "string",
            description: "Reference to the interview session being supported"
        },
        support_user_id: {
            type: "string",
            description: "ID of the support person"
        },
        start_time: {
            type: "string",
            format: "date-time",
            description: "When support session started"
        },
        end_time: {
            type: "string",
            format: "date-time",
            description: "When support session ended"
        },
        status: {
            type: "string",
            enum: ["active", "ended", "paused"],
            default: "active",
            description: "Current status of support session"
        },
        interventions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    timestamp: { type: "string", format: "date-time" },
                    type: {
                        type: "string",
                        enum: ["suggestion", "highlight", "injection", "note", "voice_call"]
                    },
                    content: { type: "string" },
                    conversation_id: { type: "string" },
                    user_acknowledged: { type: "boolean", default: false }
                }
            },
            description: "List of support interventions"
        },
        notes: {
            type: "string",
            description: "Support person's notes about the session"
        },
        rating: {
            type: "number",
            minimum: 1,
            maximum: 5,
            description: "User rating of support quality"
        },
        feedback: {
            type: "string",
            description: "User feedback about the support session"
        },
        total_interventions: {
            type: "number",
            default: 0,
            description: "Total number of interventions made"
        },
        average_response_time: {
            type: "number",
            description: "Average time to respond to user needs in seconds"
        },
        communication_channel: {
            type: "string",
            enum: ["text", "voice", "both"],
            default: "text",
            description: "Primary communication method used"
        },
        session_quality_score: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "AI-generated quality score for the support session"
        }
    },
    required: [
        "interview_session_id",
        "support_user_id"
    ]
};

export default SupportSession; 
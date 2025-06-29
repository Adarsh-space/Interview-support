const Analytics = {
    name: "Analytics",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the analytics record"
        },
        session_id: {
            type: "string",
            description: "Reference to the interview session"
        },
        user_id: {
            type: "string",
            description: "ID of the user"
        },
        event_type: {
            type: "string",
            enum: [
                "session_start",
                "session_end",
                "question_asked",
                "ai_suggestion_generated",
                "response_sent",
                "support_requested",
                "support_intervention",
                "voice_recognition_start",
                "voice_recognition_end",
                "resume_uploaded",
                "resume_parsed",
                "link_accessed",
                "error_occurred"
            ],
            description: "Type of event being tracked"
        },
        timestamp: {
            type: "string",
            format: "date-time",
            description: "When the event occurred"
        },
        duration: {
            type: "number",
            description: "Duration of the event in seconds"
        },
        metadata: {
            type: "object",
            properties: {
                question_text: { type: "string" },
                response_text: { type: "string" },
                ai_confidence: { type: "number" },
                response_time: { type: "number" },
                error_message: { type: "string" },
                browser_info: { type: "object" },
                device_info: { type: "object" },
                location: { type: "object" }
            },
            description: "Additional event-specific data"
        },
        performance_metrics: {
            type: "object",
            properties: {
                ai_response_time: { type: "number" },
                voice_recognition_accuracy: { type: "number" },
                user_satisfaction_score: { type: "number" },
                support_response_time: { type: "number" },
                session_success_rate: { type: "number" }
            },
            description: "Performance metrics for the session"
        },
        user_behavior: {
            type: "object",
            properties: {
                questions_asked: { type: "number" },
                ai_suggestions_used: { type: "number" },
                manual_edits_made: { type: "number" },
                support_interactions: { type: "number" },
                session_duration: { type: "number" }
            },
            description: "User behavior patterns"
        }
    },
    required: [
        "session_id",
        "event_type",
        "timestamp"
    ]
};

export default Analytics; 
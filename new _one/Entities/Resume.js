const Resume = {
    name: "Resume",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the resume"
        },
        session_id: {
            type: "string",
            description: "Reference to the interview session"
        },
        file_url: {
            type: "string",
            description: "URL to the uploaded resume file"
        },
        file_name: {
            type: "string",
            description: "Original filename of the resume"
        },
        file_size: {
            type: "number",
            description: "File size in bytes"
        },
        file_type: {
            type: "string",
            description: "MIME type of the file"
        },
        upload_date: {
            type: "string",
            format: "date-time",
            description: "When the resume was uploaded"
        },
        parsed_data: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Extracted name from resume"
                },
                email: {
                    type: "string",
                    description: "Extracted email from resume"
                },
                phone: {
                    type: "string",
                    description: "Extracted phone number"
                },
                skills: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "Extracted skills"
                },
                experience: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            company: { type: "string" },
                            position: { type: "string" },
                            duration: { type: "string" },
                            description: { type: "string" }
                        }
                    },
                    description: "Work experience entries"
                },
                education: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            institution: { type: "string" },
                            degree: { type: "string" },
                            field: { type: "string" },
                            year: { type: "string" }
                        }
                    },
                    description: "Education entries"
                },
                summary: {
                    type: "string",
                    description: "Professional summary"
                }
            }
        },
        ai_summary: {
            type: "string",
            description: "AI-generated summary of the resume"
        },
        key_highlights: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Key highlights extracted by AI"
        },
        suggested_questions: {
            type: "array",
            items: {
                type: "string"
            },
            description: "AI-suggested interview questions based on resume"
        },
        confidence_score: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "AI confidence in resume parsing"
        },
        parsing_status: {
            type: "string",
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
            description: "Status of resume parsing"
        },
        error_message: {
            type: "string",
            description: "Error message if parsing failed"
        }
    },
    required: [
        "session_id",
        "file_url",
        "file_name"
    ]
};

export default Resume; 
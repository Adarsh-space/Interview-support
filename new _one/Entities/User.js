const User = {
    name: "User",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the user"
        },
        email: {
            type: "string",
            format: "email",
            description: "User's email address"
        },
        full_name: {
            type: "string",
            description: "User's full name"
        },
        role: {
            type: "string",
            enum: ["admin", "support", "user"],
            default: "user",
            description: "User's role in the system"
        },
        avatar_url: {
            type: "string",
            description: "URL to user's avatar image"
        },
        is_active: {
            type: "boolean",
            default: true,
            description: "Whether the user account is active"
        },
        last_login: {
            type: "string",
            format: "date-time",
            description: "Last login timestamp"
        },
        created_date: {
            type: "string",
            format: "date-time",
            description: "When the user was created"
        },
        permissions: {
            type: "array",
            items: {
                type: "string"
            },
            description: "List of specific permissions"
        },
        settings: {
            type: "object",
            properties: {
                notifications_enabled: {
                    type: "boolean",
                    default: true
                },
                theme: {
                    type: "string",
                    enum: ["light", "dark", "auto"],
                    default: "auto"
                },
                language: {
                    type: "string",
                    default: "en"
                }
            }
        },
        session_count: {
            type: "number",
            default: 0,
            description: "Number of sessions this user has participated in"
        },
        support_sessions: {
            type: "array",
            items: {
                type: "string"
            },
            description: "List of support session IDs this user has assisted with"
        }
    },
    required: [
        "email",
        "full_name",
        "role"
    ]
};

export default User; 
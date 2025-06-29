const Notification = {
    name: "Notification",
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Unique identifier for the notification"
        },
        user_id: {
            type: "string",
            description: "ID of the user receiving the notification"
        },
        session_id: {
            type: "string",
            description: "Related session ID if applicable"
        },
        type: {
            type: "string",
            enum: ["info", "success", "warning", "error", "support", "system"],
            default: "info",
            description: "Type of notification"
        },
        title: {
            type: "string",
            description: "Notification title"
        },
        message: {
            type: "string",
            description: "Notification message"
        },
        is_read: {
            type: "boolean",
            default: false,
            description: "Whether the notification has been read"
        },
        created_at: {
            type: "string",
            format: "date-time",
            description: "When the notification was created"
        },
        read_at: {
            type: "string",
            format: "date-time",
            description: "When the notification was read"
        },
        action_url: {
            type: "string",
            description: "URL to navigate to when notification is clicked"
        },
        action_text: {
            type: "string",
            description: "Text for the action button"
        },
        priority: {
            type: "string",
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
            description: "Priority level of the notification"
        },
        expires_at: {
            type: "string",
            format: "date-time",
            description: "When the notification expires"
        },
        metadata: {
            type: "object",
            description: "Additional data for the notification"
        }
    },
    required: [
        "user_id",
        "title",
        "message"
    ]
};

export default Notification; 
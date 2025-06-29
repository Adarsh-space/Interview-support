const InterviewSession = {
  name: "InterviewSession",
  type: "object",
  properties: {
    session_name: {
      type: "string",
      description: "Name/title of the interview session"
    },
    user_link: {
      type: "string",
      description: "Unique access link for the user"
    },
    support_link: {
      type: "string",
      description: "Support access link"
    },
    expires_at: {
      type: "string",
      format: "date-time",
      description: "When the session expires"
    },
    status: {
      type: "string",
      enum: [
        "active",
        "expired",
        "completed",
        "terminated"
      ],
      default: "active",
      description: "Current session status"
    },
    duration_hours: {
      type: "number",
      default: 2,
      description: "Session duration in hours"
    },
    resume_url: {
      type: "string",
      description: "Uploaded resume file URL"
    },
    resume_summary: {
      type: "string",
      description: "AI-generated resume summary"
    },
    instructions: {
      type: "string",
      description: "Behavior and response instructions"
    },
    participant_email: {
      type: "string",
      description: "Email of the interview participant"
    }
  },
  required: [
    "session_name",
    "participant_email"
  ]
};

export default InterviewSession;
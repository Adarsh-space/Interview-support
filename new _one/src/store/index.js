import { create } from 'zustand';

// Main application store
export const useAppStore = create((set, get) => ({
    // User state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Session state
    currentSession: null,
    sessions: [],
    conversations: [],
    resume: null,

    // Interview state
    currentQuestion: '',
    aiSuggestion: '',
    userResponse: '',
    isListening: false,
    isGenerating: false,

    // Support state
    supportSession: null,
    supportInterventions: [],

    // UI state
    notifications: [],
    theme: 'dark',
    sidebarOpen: false,

    // Actions
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Session actions
    setCurrentSession: (session) => set({ currentSession: session }),
    setSessions: (sessions) => set({ sessions }),
    setConversations: (conversations) => set({ conversations }),
    setResume: (resume) => set({ resume }),

    // Interview actions
    setCurrentQuestion: (question) => set({ currentQuestion: question }),
    setAISuggestion: (suggestion) => set({ aiSuggestion: suggestion }),
    setUserResponse: (response) => set({ userResponse: response }),
    setIsListening: (isListening) => set({ isListening }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),

    // Support actions
    setSupportSession: (session) => set({ supportSession: session }),
    setSupportInterventions: (interventions) => set({ supportInterventions: interventions }),

    // UI actions
    setNotifications: (notifications) => set({ notifications }),
    setTheme: (theme) => set({ theme }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Mock async actions for demo
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            // Mock login
            const user = { id: 1, name: 'Admin User', role: 'admin' };
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({
            user: null,
            isAuthenticated: false,
            currentSession: null,
            sessions: [],
            conversations: [],
            resume: null,
            currentQuestion: '',
            aiSuggestion: '',
            userResponse: '',
            isListening: false,
            isGenerating: false,
            supportSession: null,
            supportInterventions: [],
            notifications: []
        });
    },

    loadSessions: async () => {
        set({ isLoading: true });
        try {
            // Mock sessions data
            const sessions = [
                {
                    id: '1',
                    session_name: 'Frontend Developer Interview',
                    participant_email: 'john@example.com',
                    status: 'active',
                    created_date: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '2',
                    session_name: 'Backend Developer Interview',
                    participant_email: 'jane@example.com',
                    status: 'completed',
                    created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    expires_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
                }
            ];
            set({ sessions, isLoading: false });
            return sessions;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    generateAISuggestion: async () => {
        const { currentQuestion } = get();

        if (!currentQuestion.trim()) {
            throw new Error('Please enter a question first');
        }

        set({ isGenerating: true, error: null });

        try {
            // Mock AI suggestion
            const suggestion = `Based on your experience, I would suggest focusing on the key aspects of ${currentQuestion.toLowerCase()}. This demonstrates your expertise and shows how you approach challenges.`;

            set({
                aiSuggestion: suggestion,
                userResponse: suggestion, // Auto-fill response
                isGenerating: false
            });

            return { suggestion, confidence: 0.8 };
        } catch (error) {
            set({ error: error.message, isGenerating: false });
            throw error;
        }
    },

    saveConversation: async () => {
        const { currentQuestion, userResponse, currentSession } = get();

        if (!currentQuestion.trim() || !userResponse.trim()) {
            throw new Error('Please provide both question and response');
        }

        try {
            // Mock conversation save
            const conversation = {
                id: Date.now().toString(),
                session_id: currentSession?.id || '1',
                question: currentQuestion.trim(),
                ai_suggestion: get().aiSuggestion,
                user_response: userResponse.trim(),
                timestamp: new Date().toISOString()
            };

            // Add to conversations
            const { conversations } = get();
            set({ conversations: [...conversations, conversation] });

            // Clear current inputs
            set({
                currentQuestion: '',
                aiSuggestion: '',
                userResponse: ''
            });

            return conversation;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    }
})); 
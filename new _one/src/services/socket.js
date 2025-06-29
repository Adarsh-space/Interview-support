import { createWebSocket } from './api';
import { v4 as uuidv4 } from 'uuid';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
    }

    connect(sessionId, token) {
        if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        this.isConnecting = true;

        try {
            this.socket = createWebSocket(sessionId, token);

            this.socket.onopen = () => {
                console.log('WebSocket connected successfully');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.emit('connection_established', { sessionId, timestamp: new Date().toISOString() });
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
                this.isConnecting = false;
                this.handleReconnect(sessionId, token);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
            };

        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
            this.isConnecting = false;
        }
    }

    handleReconnect(sessionId, token) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            this.connect(sessionId, token);
        }, delay);
    }

    handleMessage(data) {
        const { type, payload } = data;

        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error(`Error in ${type} listener:`, error);
                }
            });
        }
    }

    emit(type, payload) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const message = {
                id: uuidv4(),
                type,
                payload,
                timestamp: new Date().toISOString()
            };

            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, cannot emit message:', type);
        }
    }

    on(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
    }

    off(type, callback) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).delete(callback);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.listeners.clear();
        this.reconnectAttempts = 0;
        this.isConnecting = false;
    }

    // Specific event emitters for interview platform
    emitQuestion(question, sessionId) {
        this.emit('question_asked', {
            question,
            sessionId,
            timestamp: new Date().toISOString()
        });
    }

    emitResponse(response, conversationId) {
        this.emit('response_sent', {
            response,
            conversationId,
            timestamp: new Date().toISOString()
        });
    }

    emitAISuggestion(suggestion, conversationId) {
        this.emit('ai_suggestion', {
            suggestion,
            conversationId,
            timestamp: new Date().toISOString()
        });
    }

    emitSupportIntervention(intervention, sessionId) {
        this.emit('support_intervention', {
            ...intervention,
            sessionId,
            timestamp: new Date().toISOString()
        });
    }

    emitVoiceRecognition(transcript, isFinal) {
        this.emit('voice_recognition', {
            transcript,
            isFinal,
            timestamp: new Date().toISOString()
        });
    }

    emitSessionStatus(status, sessionId) {
        this.emit('session_status', {
            status,
            sessionId,
            timestamp: new Date().toISOString()
        });
    }

    // Listeners for specific events
    onQuestionReceived(callback) {
        this.on('question_received', callback);
    }

    onResponseReceived(callback) {
        this.on('response_received', callback);
    }

    onAISuggestionReceived(callback) {
        this.on('ai_suggestion_received', callback);
    }

    onSupportInterventionReceived(callback) {
        this.on('support_intervention_received', callback);
    }

    onVoiceRecognitionReceived(callback) {
        this.on('voice_recognition_received', callback);
    }

    onSessionStatusChanged(callback) {
        this.on('session_status_changed', callback);
    }

    onUserJoined(callback) {
        this.on('user_joined', callback);
    }

    onUserLeft(callback) {
        this.on('user_left', callback);
    }

    onError(callback) {
        this.on('error', callback);
    }

    // Utility methods
    isConnected() {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    getConnectionState() {
        if (!this.socket) return 'disconnected';

        switch (this.socket.readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
                return 'closing';
            case WebSocket.CLOSED:
                return 'closed';
            default:
                return 'unknown';
        }
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 
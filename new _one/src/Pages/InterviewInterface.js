import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import {
    Mic,
    MicOff,
    Send,
    Brain,
    Save,
    Clock,
    Volume2,
    VolumeX,
    Settings,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

const InterviewInterface = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const {
        currentSession,
        currentQuestion,
        aiSuggestion,
        userResponse,
        isListening,
        isGenerating,
        setCurrentQuestion,
        setUserResponse,
        setIsListening,
        generateAISuggestion,
        saveConversation
    } = useAppStore();

    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [sessionTimer, setSessionTimer] = useState(0);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [supportRequested, setSupportRequested] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const timerRef = useRef(null);

    // Session timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSessionTimer(prev => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Audio level monitoring
    useEffect(() => {
        if (isRecording && !isMuted) {
            startAudioMonitoring();
        } else {
            stopAudioMonitoring();
        }
    }, [isRecording, isMuted]);

    const startAudioMonitoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

            microphoneRef.current.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateAudioLevel = () => {
                if (!isRecording) return;

                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                setAudioLevel(average);

                requestAnimationFrame(updateAudioLevel);
            };

            updateAudioLevel();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopAudioMonitoring = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setAudioLevel(0);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        setIsListening(!isRecording);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleGenerateSuggestion = async () => {
        if (!currentQuestion.trim()) {
            alert('Please enter a question first');
            return;
        }

        try {
            await generateAISuggestion();
        } catch (error) {
            console.error('Error generating suggestion:', error);
        }
    };

    const handleSaveConversation = async () => {
        if (!currentQuestion.trim() || !userResponse.trim()) {
            alert('Please provide both question and response');
            return;
        }

        try {
            const conversation = await saveConversation();
            setConversationHistory(prev => [...prev, conversation]);
            setCurrentQuestion('');
            setUserResponse('');
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    };

    const requestSupport = () => {
        setSupportRequested(true);
        // In a real app, this would send a notification to support staff
        alert('Support request sent! A support agent will join shortly.');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Interview Session
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Session ID: {sessionId}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <span className="text-lg font-mono text-gray-900 dark:text-white">
                                {formatTime(sessionTimer)}
                            </span>
                        </div>
                        <Button
                            onClick={requestSupport}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <span>Request Support</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Interview Area */}
                    <div className="space-y-6">
                        {/* Question Input */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Interview Question
                            </h2>
                            <Textarea
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                placeholder="Enter your interview question here..."
                                rows={3}
                                className="mb-4"
                            />
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleGenerateSuggestion}
                                    disabled={isGenerating || !currentQuestion.trim()}
                                    className="flex items-center space-x-2"
                                >
                                    <Brain className="h-4 w-4" />
                                    <span>{isGenerating ? 'Generating...' : 'Get AI Suggestion'}</span>
                                </Button>
                            </div>
                        </Card>

                        {/* AI Suggestion */}
                        {aiSuggestion && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    AI Suggestion
                                </h2>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-gray-800 dark:text-gray-200">
                                        {aiSuggestion}
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* Response Input */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Candidate Response
                            </h2>
                            <Textarea
                                value={userResponse}
                                onChange={(e) => setUserResponse(e.target.value)}
                                placeholder="Type or speak your response..."
                                rows={4}
                                className="mb-4"
                            />
                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={toggleRecording}
                                    variant={isRecording ? "destructive" : "default"}
                                    className="flex items-center space-x-2"
                                >
                                    {isRecording ? (
                                        <>
                                            <MicOff className="h-4 w-4" />
                                            <span>Stop Recording</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-4 w-4" />
                                            <span>Start Recording</span>
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={toggleMute}
                                    variant="outline"
                                    className="flex items-center space-x-2"
                                >
                                    {isMuted ? (
                                        <>
                                            <VolumeX className="h-4 w-4" />
                                            <span>Unmute</span>
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="h-4 w-4" />
                                            <span>Mute</span>
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleSaveConversation}
                                    disabled={!currentQuestion.trim() || !userResponse.trim()}
                                    className="flex items-center space-x-2"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>Save Response</span>
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Audio Level Monitor */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Audio Level
                            </h2>
                            <div className="space-y-2">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-100"
                                        style={{ width: `${(audioLevel / 255) * 100}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isRecording ? 'Recording...' : 'Not recording'}
                                </p>
                            </div>
                        </Card>

                        {/* Session Status */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Session Status
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                    <span className="font-medium">{formatTime(sessionTimer)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                                    <span className="font-medium">{conversationHistory.length}</span>
                                </div>
                                {supportRequested && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Support:</span>
                                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                                            Requested
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Conversation History */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Conversation History
                            </h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {conversationHistory.length > 0 ? (
                                    conversationHistory.map((conv, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                Q: {conv.question}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                A: {conv.user_response}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                                        No conversations yet
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewInterface; 
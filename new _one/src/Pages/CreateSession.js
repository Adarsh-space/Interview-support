import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import {
    Plus,
    Upload,
    Copy,
    Link,
    Brain,
    FileText,
    Calendar,
    Clock,
    User,
    Mail
} from 'lucide-react';

const CreateSession = () => {
    const navigate = useNavigate();
    const { setCurrentSession } = useAppStore();

    const [formData, setFormData] = useState({
        sessionName: '',
        participantEmail: '',
        instructions: '',
        duration: 60,
        resumeFile: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                resumeFile: file
            }));
            // Auto-analyze resume when uploaded
            analyzeResume(file);
        }
    };

    const analyzeResume = async (file) => {
        setIsAnalyzing(true);
        try {
            // Mock resume analysis
            await new Promise(resolve => setTimeout(resolve, 2000));

            const analysis = {
                skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
                experience: '5+ years in software development',
                education: 'Bachelor\'s in Computer Science',
                summary: 'Experienced full-stack developer with expertise in modern web technologies.',
                recommendations: [
                    'Focus on system design questions',
                    'Ask about cloud deployment experience',
                    'Discuss team collaboration scenarios'
                ]
            };

            setResumeAnalysis(analysis);
        } catch (error) {
            console.error('Error analyzing resume:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateSessionLink = () => {
        const sessionId = Date.now().toString();
        const token = Math.random().toString(36).substring(2, 15);
        const link = `${window.location.origin}/interview/${sessionId}?token=${token}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copied to clipboard!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock session creation
            const session = {
                id: Date.now().toString(),
                session_name: formData.sessionName,
                participant_email: formData.participantEmail,
                instructions: formData.instructions,
                duration: formData.duration,
                status: 'created',
                created_date: new Date().toISOString(),
                expires_at: new Date(Date.now() + formData.duration * 60 * 1000).toISOString(),
                resume_analysis: resumeAnalysis
            };

            setCurrentSession(session);
            generateSessionLink();

            // Navigate to dashboard after creation
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Create New Interview Session
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Set up a new interview session with AI assistance and real-time features
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Session Form */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Session Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Session Name
                                </label>
                                <input
                                    type="text"
                                    name="sessionName"
                                    value={formData.sessionName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="e.g., Frontend Developer Interview"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Participant Email
                                </label>
                                <input
                                    type="email"
                                    name="participantEmail"
                                    value={formData.participantEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="participant@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Duration (minutes)
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Interview Instructions
                                </label>
                                <Textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    placeholder="Provide specific instructions for the AI assistant..."
                                    rows={4}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Resume Upload (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="resume-upload"
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="cursor-pointer text-blue-600 hover:text-blue-500"
                                        >
                                            Choose a file
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            PDF, DOC, or DOCX up to 10MB
                                        </p>
                                    </div>
                                    {formData.resumeFile && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✓ {formData.resumeFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating Session...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Session
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Card>

                    {/* Generated Link and Resume Analysis */}
                    <div className="space-y-6">
                        {generatedLink && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Session Link Generated
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Share this link with the participant:
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={generatedLink}
                                                readOnly
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <Button
                                                onClick={copyToClipboard}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                            Next Steps:
                                        </h4>
                                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                            <li>• Send the link to the participant</li>
                                            <li>• The link will expire in {formData.duration} minutes</li>
                                            <li>• Monitor the session from your dashboard</li>
                                            <li>• Provide support if needed</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Resume Analysis */}
                        {resumeAnalysis && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Resume Analysis
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeAnalysis.skills.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Experience</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{resumeAnalysis.experience}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Recommendations</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            {resumeAnalysis.recommendations.map((rec, index) => (
                                                <li key={index}>• {rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {isAnalyzing && (
                            <Card className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Analyzing resume...</span>
                                </div>
                            </Card>
                        )}

                        {/* Features Preview */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Session Features
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Real-time voice-to-text conversion
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        AI-powered response suggestions
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Resume analysis and context
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Live support intervention
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Conversation history tracking
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSession; 
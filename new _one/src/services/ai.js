import { aiAPI } from './api';

class AIService {
    constructor() {
        this.defaultPrompt = `You are an AI interview assistant. Help the user answer questions with short, professional, confident answers based on the resume provided.`;
        this.maxContextLength = 2000;
        this.maxResponseLength = 150;
    }

    // Generate AI suggestion for interview response
    async generateSuggestion(data) {
        const {
            question,
            resumeSummary,
            instructions,
            conversationHistory,
            sessionContext
        } = data;

        try {
            const prompt = this.buildPrompt({
                question,
                resumeSummary,
                instructions,
                conversationHistory,
                sessionContext
            });

            const response = await aiAPI.generateSuggestion({
                prompt,
                maxTokens: this.maxResponseLength,
                temperature: 0.7,
                context: {
                    resumeSummary,
                    instructions,
                    conversationHistory: conversationHistory?.slice(-3) || []
                }
            });

            return {
                suggestion: response.suggestion,
                confidence: response.confidence || 0.8,
                reasoning: response.reasoning,
                alternatives: response.alternatives || []
            };
        } catch (error) {
            console.error('Error generating AI suggestion:', error);
            throw new Error('Failed to generate AI suggestion');
        }
    }

    // Build optimized prompt for interview responses
    buildPrompt(data) {
        const {
            question,
            resumeSummary,
            instructions,
            conversationHistory,
            sessionContext
        } = data;

        let prompt = this.defaultPrompt + '\n\n';

        // Add resume context
        if (resumeSummary) {
            prompt += `Resume Summary: ${resumeSummary}\n\n`;
        }

        // Add session instructions
        if (instructions) {
            prompt += `Interview Instructions: ${instructions}\n\n`;
        }

        // Add conversation history context
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-3);
            prompt += `Recent Conversation Context:\n`;
            recentHistory.forEach((conv, index) => {
                prompt += `${index + 1}. Q: ${conv.question}\n   A: ${conv.user_response || conv.ai_suggestion}\n`;
            });
            prompt += '\n';
        }

        // Add session context
        if (sessionContext) {
            prompt += `Session Context: ${sessionContext}\n\n`;
        }

        // Add current question
        prompt += `Current Question: ${question}\n\n`;

        // Add response guidelines
        prompt += `Guidelines:
- Keep response under 3 sentences
- Be confident and professional
- Tailor answer to resume and question
- Use specific examples when possible
- Maintain consistent tone throughout interview

Response:`;

        return prompt;
    }

    // Analyze resume and extract key information
    async analyzeResume(file) {
        try {
            const response = await aiAPI.analyzeResume(file);

            return {
                summary: response.summary,
                keyHighlights: response.keyHighlights || [],
                skills: response.skills || [],
                experience: response.experience || [],
                education: response.education || [],
                suggestedQuestions: response.suggestedQuestions || [],
                confidence: response.confidence || 0.8,
                parsedData: response.parsedData || {}
            };
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error('Failed to analyze resume');
        }
    }

    // Transcribe audio to text
    async transcribeAudio(audioBlob) {
        try {
            const response = await aiAPI.transcribeAudio(audioBlob);

            return {
                transcript: response.transcript,
                confidence: response.confidence || 0.8,
                duration: response.duration,
                language: response.language || 'en-US',
                segments: response.segments || []
            };
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw new Error('Failed to transcribe audio');
        }
    }

    // Generate follow-up questions based on conversation
    async generateFollowUpQuestions(conversationHistory, resumeSummary) {
        try {
            const prompt = `Based on the interview conversation so far and the candidate's resume, suggest 3-5 relevant follow-up questions that would help assess their qualifications and fit for the role.

Resume Summary: ${resumeSummary}

Recent Questions Asked:
${conversationHistory.slice(-5).map((conv, i) => `${i + 1}. ${conv.question}`).join('\n')}

Generate follow-up questions that:
- Build upon previous answers
- Explore specific skills mentioned in resume
- Assess problem-solving abilities
- Evaluate cultural fit
- Cover any gaps in the conversation

Follow-up Questions:`;

            const response = await aiAPI.generateSuggestion({
                prompt,
                maxTokens: 300,
                temperature: 0.8
            });

            return {
                questions: response.suggestion.split('\n').filter(q => q.trim().length > 0),
                reasoning: response.reasoning
            };
        } catch (error) {
            console.error('Error generating follow-up questions:', error);
            return { questions: [], reasoning: 'Failed to generate questions' };
        }
    }

    // Analyze conversation sentiment and provide feedback
    async analyzeConversationSentiment(conversationHistory) {
        try {
            const prompt = `Analyze the following interview conversation and provide feedback on the candidate's performance:

${conversationHistory.map((conv, i) =>
                `Q${i + 1}: ${conv.question}\nA${i + 1}: ${conv.user_response || conv.ai_suggestion}`
            ).join('\n\n')}

Provide analysis on:
1. Communication clarity (1-10)
2. Confidence level (1-10)
3. Technical knowledge (1-10)
4. Overall impression
5. Areas for improvement
6. Recommended next steps

Analysis:`;

            const response = await aiAPI.generateSuggestion({
                prompt,
                maxTokens: 400,
                temperature: 0.6
            });

            return {
                analysis: response.suggestion,
                scores: this.extractScores(response.suggestion),
                recommendations: this.extractRecommendations(response.suggestion)
            };
        } catch (error) {
            console.error('Error analyzing conversation sentiment:', error);
            return {
                analysis: 'Unable to analyze conversation',
                scores: {},
                recommendations: []
            };
        }
    }

    // Extract scores from analysis text
    extractScores(analysis) {
        const scores = {};
        const scoreRegex = /(\w+)\s*\((\d+)-(\d+)\)/g;
        let match;

        while ((match = scoreRegex.exec(analysis)) !== null) {
            const [, category, score] = match;
            scores[category.toLowerCase()] = parseInt(score);
        }

        return scores;
    }

    // Extract recommendations from analysis text
    extractRecommendations(analysis) {
        const recommendations = [];
        const lines = analysis.split('\n');

        for (const line of lines) {
            if (line.includes('improvement') || line.includes('recommend') || line.includes('suggest')) {
                recommendations.push(line.trim());
            }
        }

        return recommendations;
    }

    // Generate interview preparation tips
    async generatePreparationTips(resumeSummary, jobDescription) {
        try {
            const prompt = `Based on the candidate's resume and job description, provide specific interview preparation tips:

Resume Summary: ${resumeSummary}
Job Description: ${jobDescription}

Provide tips for:
1. Key talking points to emphasize
2. Potential questions to prepare for
3. Examples to have ready
4. Areas to research
5. Questions to ask the interviewer

Preparation Tips:`;

            const response = await aiAPI.generateSuggestion({
                prompt,
                maxTokens: 500,
                temperature: 0.7
            });

            return {
                tips: response.suggestion.split('\n').filter(tip => tip.trim().length > 0),
                keyPoints: this.extractKeyPoints(response.suggestion)
            };
        } catch (error) {
            console.error('Error generating preparation tips:', error);
            return { tips: [], keyPoints: [] };
        }
    }

    // Extract key points from tips
    extractKeyPoints(tips) {
        const keyPoints = [];
        const lines = tips.split('\n');

        for (const line of lines) {
            if (line.includes('•') || line.includes('-') || line.match(/^\d+\./)) {
                keyPoints.push(line.trim());
            }
        }

        return keyPoints;
    }

    // Validate and improve user response
    async validateResponse(response, question, resumeSummary) {
        try {
            const prompt = `Review this interview response and suggest improvements:

Question: ${question}
Response: ${response}
Resume Context: ${resumeSummary}

Evaluate:
1. Relevance to question (1-10)
2. Professionalism (1-10)
3. Specificity (1-10)
4. Confidence level (1-10)

Provide:
- Overall score
- Specific improvements
- Alternative phrasing if needed

Evaluation:`;

            const aiResponse = await aiAPI.generateSuggestion({
                prompt,
                maxTokens: 300,
                temperature: 0.6
            });

            return {
                originalResponse: response,
                evaluation: aiResponse.suggestion,
                score: this.extractOverallScore(aiResponse.suggestion),
                improvements: this.extractImprovements(aiResponse.suggestion),
                alternativeResponse: this.extractAlternativeResponse(aiResponse.suggestion)
            };
        } catch (error) {
            console.error('Error validating response:', error);
            return {
                originalResponse: response,
                evaluation: 'Unable to evaluate response',
                score: 5,
                improvements: [],
                alternativeResponse: null
            };
        }
    }

    // Extract overall score from evaluation
    extractOverallScore(evaluation) {
        const scoreMatch = evaluation.match(/overall score[:\s]*(\d+)/i);
        return scoreMatch ? parseInt(scoreMatch[1]) : 5;
    }

    // Extract improvements from evaluation
    extractImprovements(evaluation) {
        const improvements = [];
        const lines = evaluation.split('\n');

        for (const line of lines) {
            if (line.includes('improve') || line.includes('better') || line.includes('suggest')) {
                improvements.push(line.trim());
            }
        }

        return improvements;
    }

    // Extract alternative response from evaluation
    extractAlternativeResponse(evaluation) {
        const alternativeMatch = evaluation.match(/alternative[:\s]*(.+)/i);
        return alternativeMatch ? alternativeMatch[1].trim() : null;
    }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;

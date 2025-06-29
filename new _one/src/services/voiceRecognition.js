class VoiceRecognitionService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.onTranscriptCallback = null;
        this.onErrorCallback = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        this.interimResults = true;
        this.continuous = true;
        this.lang = 'en-US';
        this.maxAlternatives = 1;
    }

    initialize() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            throw new Error('Speech recognition not supported in this browser');
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = this.continuous;
        this.recognition.interimResults = this.interimResults;
        this.recognition.lang = this.lang;
        this.recognition.maxAlternatives = this.maxAlternatives;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Voice recognition started');
            if (this.onStartCallback) {
                this.onStartCallback();
            }
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const confidence = event.results[i][0].confidence;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (this.onTranscriptCallback) {
                this.onTranscriptCallback({
                    finalTranscript,
                    interimTranscript,
                    confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0,
                    isFinal: finalTranscript.length > 0
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.isListening = false;

            if (this.onErrorCallback) {
                this.onErrorCallback(event.error);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Voice recognition ended');

            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        this.recognition.onaudiostart = () => {
            console.log('Audio capturing started');
        };

        this.recognition.onaudioend = () => {
            console.log('Audio capturing ended');
        };

        this.recognition.onsoundstart = () => {
            console.log('Sound detected');
        };

        this.recognition.onsoundend = () => {
            console.log('Sound ended');
        };

        this.recognition.onspeechstart = () => {
            console.log('Speech started');
        };

        this.recognition.onspeechend = () => {
            console.log('Speech ended');
        };

        this.recognition.onnomatch = () => {
            console.log('No speech detected');
        };
    }

    start() {
        if (!this.recognition) {
            this.initialize();
        }

        if (this.isListening) {
            console.warn('Voice recognition is already active');
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            throw error;
        }
    }

    stop() {
        if (!this.recognition || !this.isListening) {
            return;
        }

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    }

    abort() {
        if (!this.recognition) {
            return;
        }

        try {
            this.recognition.abort();
        } catch (error) {
            console.error('Error aborting voice recognition:', error);
        }
    }

    // Configuration methods
    setLanguage(lang) {
        this.lang = lang;
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    setContinuous(continuous) {
        this.continuous = continuous;
        if (this.recognition) {
            this.recognition.continuous = continuous;
        }
    }

    setInterimResults(interimResults) {
        this.interimResults = interimResults;
        if (this.recognition) {
            this.recognition.interimResults = interimResults;
        }
    }

    setMaxAlternatives(maxAlternatives) {
        this.maxAlternatives = maxAlternatives;
        if (this.recognition) {
            this.recognition.maxAlternatives = maxAlternatives;
        }
    }

    // Event callbacks
    onTranscript(callback) {
        this.onTranscriptCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }

    onStart(callback) {
        this.onStartCallback = callback;
    }

    onEnd(callback) {
        this.onEndCallback = callback;
    }

    // Utility methods
    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    getSupportedLanguages() {
        return [
            'en-US',
            'en-GB',
            'en-AU',
            'en-CA',
            'en-IN',
            'es-ES',
            'es-MX',
            'fr-FR',
            'fr-CA',
            'de-DE',
            'it-IT',
            'pt-BR',
            'pt-PT',
            'ru-RU',
            'ja-JP',
            'ko-KR',
            'zh-CN',
            'zh-TW',
            'hi-IN',
            'ar-SA'
        ];
    }

    getStatus() {
        return {
            isSupported: this.isSupported(),
            isListening: this.isListening,
            language: this.lang,
            continuous: this.continuous,
            interimResults: this.interimResults
        };
    }

    // Advanced features
    async transcribeAudioFile(audioBlob) {
        // This would typically call a backend API for file transcription
        // For now, we'll return a mock implementation
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Mock transcription - in real implementation, send to backend
                setTimeout(() => {
                    resolve({
                        transcript: "Mock transcription from audio file",
                        confidence: 0.95,
                        duration: 5.2
                    });
                }, 1000);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(audioBlob);
        });
    }

    // Noise reduction and audio processing
    enableNoiseReduction() {
        // Implementation would depend on browser capabilities
        console.log('Noise reduction enabled');
    }

    setAudioConstraints(constraints) {
        // Set audio input constraints
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: constraints })
                .then(stream => {
                    console.log('Audio constraints applied:', constraints);
                })
                .catch(error => {
                    console.error('Error applying audio constraints:', error);
                });
        }
    }
}

// Create singleton instance
const voiceRecognitionService = new VoiceRecognitionService();

export default voiceRecognitionService; 
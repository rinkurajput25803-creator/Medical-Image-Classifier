import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import type { AnalysisResult } from './types';
import { analyzeXRayImage } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Analyzing image, please wait...');

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      const messages = [
        "Analyzing anatomical structures...",
        "Identifying potential anomalies...",
        "Consulting with AI medical knowledge base...",
        "Finalizing diagnostic probabilities...",
      ];
      let messageIndex = 0;
      setLoadingMessage(messages[0]);
      
      interval = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadedImage(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const base64Image = await fileToBase64(file);
      const result = await analyzeXRayImage(base64Image);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-surface rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2">X-Ray Analysis POC</h2>
          <p className="text-center text-text-secondary mb-6">
            Upload a chest X-ray image to get a simulated diagnostic analysis powered by Gemini.
          </p>

          {error && <ErrorMessage message={error} />}
          
          {!imageUrl && <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading}/>}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader />
              <p className="mt-4 text-lg text-primary text-center">{loadingMessage}</p>
            </div>
          )}

          {imageUrl && !isLoading && analysisResult && (
            <div>
              <ResultsDisplay imageUrl={imageUrl} result={analysisResult} />
              <div className="text-center mt-8">
                 <button 
                    onClick={handleReset}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                  >
                   Analyze Another Image
                 </button>
              </div>
            </div>
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-text-secondary">
          <p>Disclaimer: This is a proof-of-concept application for demonstration purposes only. The analyses are AI-generated and should not be used for actual medical diagnosis.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
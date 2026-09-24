
import React, { useRef, useState, useEffect } from 'react';
import type { AnalysisResult, Diagnosis } from '../types';
import { DiagnosisChart } from './DiagnosisChart';

interface ResultsDisplayProps {
  imageUrl: string;
  result: AnalysisResult;
}

const AttentionMap: React.FC<{
  imageUrl: string;
  hotspot: AnalysisResult['attentionHotspot'];
}> = ({ imageUrl, hotspot }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const smallestDim = Math.min(containerSize.width, containerSize.height);
  const radiusPx = hotspot.radius * smallestDim;

  const hotspotStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${hotspot.y * 100}%`,
    left: `${hotspot.x * 100}%`,
    width: `${radiusPx * 2}px`,
    height: `${radiusPx * 2}px`,
    borderRadius: '50%',
    // transform is handled by the animation class
    border: '2px solid rgba(139, 92, 246, 0.8)',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    pointerEvents: 'none',
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg">
      <img src={imageUrl} alt="X-ray with attention map" className="w-full h-auto object-contain" />
      <div style={hotspotStyle} className="hotspot-pulse"></div>
    </div>
  );
};

const DiagnosisDetail: React.FC<{ diagnosis: Diagnosis }> = ({ diagnosis }) => (
    <div className="bg-surface p-4 rounded-lg mb-3">
        <div className="flex justify-between items-baseline">
            <h5 className="font-bold text-md text-text-primary">{diagnosis.condition}</h5>
            <span className="text-lg font-semibold text-primary">
                {(diagnosis.probability * 100).toFixed(1)}%
            </span>
        </div>
        <p className="text-sm text-text-secondary mt-1">{diagnosis.description}</p>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ imageUrl, result }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-center text-text-primary">Image with Attention Map</h3>
            <AttentionMap imageUrl={imageUrl} hotspot={result.attentionHotspot} />
        </div>
        <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-center text-text-primary">Diagnosis Probabilities</h3>
            <div className="w-full h-80 bg-surface p-4 rounded-lg shadow-inner">
                <DiagnosisChart data={result.diagnoses} />
            </div>
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-text-primary">Detailed Findings</h4>
                <div>
                    {result.diagnoses
                        .sort((a, b) => b.probability - a.probability)
                        .map((d) => <DiagnosisDetail key={d.condition} diagnosis={d} />)
                    }
                </div>
            </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3 text-text-primary">AI Summary</h3>
        <div className="bg-surface border-l-4 border-primary p-4 rounded-r-lg">
            <p className="text-text-primary">{result.summary}</p>
        </div>
      </div>
    </div>
  );
};
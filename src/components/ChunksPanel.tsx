import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoordinateChunk } from '../types';

interface ChunksPanelProps {
  chunks: CoordinateChunk[];
}

export function ChunksPanel({ chunks }: ChunksPanelProps) {
  const { t } = useTranslation();
  const [showTextareas, setShowTextareas] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="chunks-section">
      <div className="chunks-header">
        <h3>{t('coordinates')} ({chunks.length} {t('chunk').toLowerCase()}{chunks.length > 1 ? 's' : ''})</h3>
        <div className="chunks-controls">
          <button
            className="chunk-btn"
            onClick={() => setShowTextareas(!showTextareas)}
          >
            {showTextareas ? t('hideTextarea') : t('showTextarea')}
          </button>
        </div>
      </div>
      
      <div className="chunks-grid">
        {chunks.map((chunk, index) => (
          <button
            key={index}
            className={`chunk-btn primary ${copiedIndex === index ? 'copied' : ''}`}
            onClick={() => handleCopy(chunk.content, index)}
          >
            {copiedIndex === index ? t('copied') : `${t('copyChunk')} ${index + 1}`}
          </button>
        ))}
      </div>
      
      {showTextareas && (
        <div className="textareas-container">
          {chunks.map((chunk, index) => (
            <div key={index} className="textarea-item">
              <div className="textarea-header">
                <span className="chunk-label">{t('chunk')} {index + 1}</span>
                <button
                  className={`chunk-btn ${copiedIndex === index ? 'copied' : ''}`}
                  onClick={() => handleCopy(chunk.content, index)}
                >
                  {copiedIndex === index ? t('copied') : t('copyChunk')}
                </button>
              </div>
              <textarea
                className="chunk-textarea"
                value={chunk.content}
                readOnly
                rows={6}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

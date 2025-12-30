
import React, { useEffect } from 'react';
import { ImageData } from '../types';

interface LightboxProps {
  image: ImageData | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (image) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose, onNext, onPrev]);

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] p-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        
        <div className="relative group">
          <img 
            src={image.url} 
            alt={image.alt}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm"
          />
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onPrev}
          >
            ←
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onNext}
          >
            →
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium">{image.alt}</p>
          <p className="text-gray-400 text-sm mt-1">Click outside or press ESC to close</p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

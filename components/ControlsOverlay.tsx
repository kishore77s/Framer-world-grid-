
import React from 'react';
import { WorldGridConfig } from '../types';

interface ControlsOverlayProps {
  config: WorldGridConfig;
  onChange: (config: WorldGridConfig) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({ config, onChange, isOpen, setIsOpen }) => {
  const updateConfig = (key: keyof WorldGridConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 transition-all text-sm font-medium"
      >
        {isOpen ? 'Close Settings' : 'Configure Sphere'}
      </button>

      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-zinc-900/95 border-l border-zinc-800 p-8 z-30 transform transition-transform duration-300 shadow-2xl overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 className="text-xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">Sphere Controls</h2>
        
        <div className="space-y-6">
          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Image Count ({config.imageCount})
            </label>
            <input 
              type="range" min="10" max="100" step="1"
              value={config.imageCount}
              onChange={(e) => updateConfig('imageCount', parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </section>

          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Sphere Radius ({config.radius})
            </label>
            <input 
              type="range" min="2" max="15" step="0.1"
              value={config.radius}
              onChange={(e) => updateConfig('radius', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </section>

          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Image Size ({config.imageSize})
            </label>
            <input 
              type="range" min="0.2" max="3" step="0.1"
              value={config.imageSize}
              onChange={(e) => updateConfig('imageSize', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </section>

          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Rotation Speed ({config.rotationSpeed.toFixed(4)})
            </label>
            <input 
              type="range" min="0" max="0.1" step="0.001"
              value={config.rotationSpeed}
              onChange={(e) => updateConfig('rotationSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </section>

          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
              />
              <span className="text-zinc-400 text-sm font-mono">{config.backgroundColor}</span>
            </div>
          </section>

          <div className="pt-8 border-t border-zinc-800">
            <h3 className="text-zinc-500 text-xs font-bold uppercase mb-4">Interactions</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              • Drag to rotate sphere<br/>
              • Scroll to zoom in/out<br/>
              • Click image for Lightbox
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlsOverlay;

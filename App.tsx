
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ImageSphere from './components/ImageSphere';
import Lightbox from './components/Lightbox';
import ControlsOverlay from './components/ControlsOverlay';
import { WorldGridConfig, ImageData } from './types';

// Helper component to handle camera zoom with scroll
const CameraController: React.FC<{ minZoom: number; maxZoom: number }> = ({ minZoom, maxZoom }) => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.05;
      const newZ = camera.position.z + e.deltaY * zoomSpeed;
      camera.position.z = Math.min(maxZoom, Math.max(minZoom, newZ));
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [camera, gl, minZoom, maxZoom]);

  return null;
};

const App: React.FC = () => {
  const [config, setConfig] = useState<WorldGridConfig>({
    imageCount: 40,
    radius: 7,
    imageSize: 1.5,
    rotationSpeed: 0.005,
    backgroundColor: '#050505',
    minZoom: 5,
    maxZoom: 25,
    showLightbox: true,
  });

  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Generate image data based on count
  const images = useMemo(() => {
    return Array.from({ length: config.imageCount }).map((_, i) => ({
      id: i,
      url: `https://picsum.photos/seed/${i + 100}/600/800`,
      alt: `Project Showcase ${i + 1}`,
    }));
  }, [config.imageCount]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setDragRotation(prev => ({
      x: prev.x + deltaY * 0.005,
      y: prev.y + deltaX * 0.005
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleNextImage = useCallback(() => {
    if (!activeImage) return;
    const nextId = (activeImage.id + 1) % images.length;
    setActiveImage(images[nextId]);
  }, [activeImage, images]);

  const handlePrevImage = useCallback(() => {
    if (!activeImage) return;
    const prevId = (activeImage.id - 1 + images.length) % images.length;
    setActiveImage(images[prevId]);
  }, [activeImage, images]);

  return (
    <div 
      className="w-full h-full relative select-none touch-none"
      style={{ backgroundColor: config.backgroundColor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 3D Scene */}
      <Canvas
        className="cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <CameraController minZoom={config.minZoom} maxZoom={config.maxZoom} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <ImageSphere 
          images={images} 
          radius={config.radius} 
          imageSize={config.imageSize} 
          rotationSpeed={config.rotationSpeed}
          onImageClick={(img) => setActiveImage(img)}
          isDragging={isDragging}
          dragRotation={dragRotation}
        />
      </Canvas>

      {/* UI Layers */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-4xl font-black text-white tracking-tighter">WORLDGRID</h1>
        <p className="text-zinc-400 mt-2 font-medium tracking-tight">Interactive 3D Visual Archive</p>
      </div>

      <ControlsOverlay 
        config={config} 
        onChange={setConfig} 
        isOpen={isControlsOpen}
        setIsOpen={setIsControlsOpen}
      />

      <Lightbox 
        image={activeImage} 
        onClose={() => setActiveImage(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

      <div className="absolute bottom-8 left-8 z-10 text-white/30 text-xs font-mono">
        DRAG TO EXPLORE • SCROLL TO ZOOM • CLICK TO FOCUS
      </div>
    </div>
  );
};

export default App;

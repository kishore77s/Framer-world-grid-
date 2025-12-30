
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ImagePlane from './ImagePlane';
import { ImageData } from '../types';

interface ImageSphereProps {
  images: ImageData[];
  radius: number;
  imageSize: number;
  rotationSpeed: number;
  onImageClick: (image: ImageData) => void;
  isDragging: boolean;
  dragRotation: { x: number; y: number };
}

const ImageSphere: React.FC<ImageSphereProps> = ({ 
  images, 
  radius, 
  imageSize, 
  rotationSpeed, 
  onImageClick,
  isDragging,
  dragRotation
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Apply continuous rotation if not dragging
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!isDragging) {
        groupRef.current.rotation.y += rotationSpeed * delta * 10;
      } else {
        // Smoothly interpolate towards the drag rotation if needed, 
        // but for this direct drag implementation, we often handle it in the parent or via refs.
        // We'll use the dragRotation directly applied to the group in parent or here.
        groupRef.current.rotation.y = dragRotation.y;
        groupRef.current.rotation.x = dragRotation.x;
      }
    }
  });

  const distributedImages = useMemo(() => {
    const count = images.length;
    return images.map((img, i) => {
      // Golden spiral distribution on a sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      return {
        ...img,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [images, radius]);

  return (
    <group ref={groupRef}>
      {distributedImages.map((img) => (
        <ImagePlane
          key={img.id}
          url={img.url}
          alt={img.alt}
          position={img.position}
          size={imageSize}
          onClick={() => onImageClick(img)}
        />
      ))}
    </group>
  );
};

export default ImageSphere;

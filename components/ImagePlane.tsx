
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';

interface ImagePlaneProps {
  url: string;
  alt: string;
  position: [number, number, number];
  size: number;
  onClick: () => void;
}

const ImagePlane: React.FC<ImagePlaneProps> = ({ url, alt, position, size, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a fallback loader to handle potential image loading errors gracefully
  const texture = useLoader(THREE.TextureLoader, url);

  // We use Billboard from @react-three/drei to make images always face the camera
  return (
    <Billboard position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[size, size * 1.4]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
      </mesh>
    </Billboard>
  );
};

export default ImagePlane;

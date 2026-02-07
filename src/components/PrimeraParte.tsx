import boda from "../assets/optimized/Carta-primeraparte.webp";
import { useEffect, useState } from "react";

export default function PrimeraParte() {
  const [isVisible, setIsVisible] = useState(false);
  const [shrinkSpace, setShrinkSpace] = useState(false);

  useEffect(() => {
    // Mostrar la imagen
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    // Reducir el espacio después de mostrar la imagen
    const shrinkTimer = setTimeout(() => {
      setShrinkSpace(true);
    }, 3000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(shrinkTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Espaciador superior que se anima */}
      <div 
        style={{
          height: shrinkSpace ? '2rem' : '35vh',
          transition: 'height 3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      <style>{`
        .imagen-primera-parte {
          width: 95vw;
          max-width: 700px;
          height: auto;
        }
        
        @media (min-width: 768px) {
          .imagen-primera-parte {
            width: 80vw;
            max-width: 1000px;
          }
        }
        
        @media (min-width: 1024px) {
          .imagen-primera-parte {
            width: 70vw;
            max-width: 1200px;
          }
        }
      `}</style>
      
      <img
        src={boda}
        alt="Boda"
        className="w-screen h-auto scale-125 md:scale-100 md:w-auto imagen-primera-parte"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      />
      
      {/* Espaciador inferior que se anima */}
      <div 
        style={{
          height: shrinkSpace ? '0' : '35vh',
          transition: 'height 3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}







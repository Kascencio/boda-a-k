import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Wait for the fade-out transition to finish before hiding completely (optional cleanup)
      const t = setTimeout(() => setVisible(false), 500); // match transition duration
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#2f3c2d] transition-opacity duration-500 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple elegant spinner */}
        <div className="w-12 h-12 border-4 border-[#4a5c3f] border-t-white rounded-full animate-spin"></div>
        <p className="text-white font-serif tracking-widest text-lg opacity-80 animate-pulse">
          Azucena y Kevin
        </p>
      </div>
    </div>
  );
}

import bd from "../assets/optimized/carta-p6.webp";

export default function SextaParte() {
    return (
        <div className="flex justify-center">
            <img 
              src={bd} 
              alt="Boda" 
              className="w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto" 
              loading="lazy"
              decoding="async"
            />
        </div>
    );
}
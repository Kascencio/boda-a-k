import bd from "../assets/carta-p2.png";

export default function SegundaParte() {
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
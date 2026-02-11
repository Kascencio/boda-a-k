import bd from "../assets/optimized/carta-p2.webp";

export default function SegundaParte() {
    return (
        <div className="flex justify-center">
            <img 
              src={bd} 
              alt="Boda" 
              className="w-screen h-auto sm:scale-150 md:scale-50 lg:scale-70"
              loading="lazy"
              decoding="async"
            />
        </div>
    );
}
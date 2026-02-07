import bd from "../assets/optimized/carta-p7.webp";

export default function SeptimaParte() {
  return (
    <div className="flex justify-center">
      <img
        src={bd}
        alt="Boda"
        loading="lazy"
        decoding="async"
        className="w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
      />
    </div>
  );
}

import bd from "../assets/optimized/carta-p5.webp";

export default function QuintaParte() {
  return (
    <div className="flex justify-center">
      <img
        src={bd}
        alt="Boda"
        loading="lazy"
        decoding="async"
        className="w-[92vw] max-w-sm sm:max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl h-auto cursor-pointer hover:opacity-90 transition-opacity"
      />
    </div>
  );
}

import bd from "../assets/optimized/cuarta-parte.webp";

export default function CuartaParte() {
  return (
    <div className="flex justify-center mt-16">
      <img
        src={bd}
        alt="Boda"
        className="w-11/12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto cursor-pointer hover:opacity-90 transition-opacity"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

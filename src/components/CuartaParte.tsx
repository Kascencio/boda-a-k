import bd from "../assets/carta-p4.png";

export default function CuartaParte() {
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

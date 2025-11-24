import { useState } from "react";

export default function GaleriaImagenes({ imagenes, nombre }) {
  const imagenesLimpias = imagenes.map((img) => img.url ?? img);

  const [imagenActual, setImagenActual] = useState(imagenesLimpias[0]);

  return (
    <div className="flex flex-col items-center mb-8">

      <div className="w-full max-w-2xl h-80 sm:h-96 bg-white shadow rounded-xl flex items-center justify-center overflow-hidden mb-4">
        <img
          src={`http://localhost:8080${imagenActual}`}
          alt={nombre}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {imagenesLimpias.map((url, idx) => (
          <img
            key={idx}
            src={`http://localhost:8080${url}`}
            onClick={() => setImagenActual(url)}
            className={`w-20 h-20 object-contain cursor-pointer rounded-xl border 
              ${
                imagenActual === url
                  ? "border-yellow-500 shadow-md"
                  : "border-gray-300"
              }
              hover:scale-105 transition
            `}
          />
        ))}
      </div>
    </div>
  );
}

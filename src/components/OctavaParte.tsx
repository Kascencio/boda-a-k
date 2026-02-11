import { useState } from 'react';

// Mock Guest Lists
const PHONE_KEVIN = '529934010672';
const PHONE_AZUCENA = '529932899001';

const GUEST_LIST_KEVIN = [
  { name: 'Jacobina de la Flor', tickets: 2 },
  { name: 'Isaac Perez', tickets: 1 },
  { name: 'Moises Ramos', tickets: 1 },
  { name: 'Kevin Eduardo Ascencio de la Flor', tickets: 1 },
  { name: 'Sandra Luz', tickets: 1 },
  { name: 'Olga Beatriz', tickets: 1 },
  { name: 'Ana Mendiola', tickets: 2 },
  { name: 'Anda De la Flor', tickets: 1 },
  { name: 'Luis Gustavo', tickets: 2 },
  { name: 'Ari Bautista', tickets: 1 },
  { name: 'Marcos Perez', tickets: 1 },
  { name: 'Hector De la Flor', tickets: 1 },
  { name: 'Edgar Ascencio', tickets: 1 },
  { name: 'Claudia Mendez', tickets: 2 },
  { name: 'Jorge Santiago', tickets: 1 },
  { name: 'Sergio Reyes', tickets: 1 },
  { name: 'Marcos Ramos', tickets: 1 },
];

const GUEST_LIST_AZUCENA = [
  { name: 'Maria Gonzalez', tickets: 2 },
  { name: 'Familia Rodriguez', tickets: 4 },
  { name: 'Azucena', tickets: 1 },
];

export default function OctavaParte() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<{ found: boolean; data?: { name: string; tickets: number; phone: string } } | null>(null);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Levenshtein distance for fuzzy matching
  const levenshteinDistance = (a: string, b: string) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1 // deletion
            )
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  const searchInList = (list: typeof GUEST_LIST_KEVIN, inputName: string, phone: string) => {
    let bestMatch = null;
    let minDistance = Infinity;

    list.forEach((guest) => {
      const normalizedGuest = normalizeText(guest.name);
      const distance = levenshteinDistance(inputName, normalizedGuest);
      
      const maxLength = Math.max(inputName.length, normalizedGuest.length);
      const similarity = 1 - distance / maxLength;

      if (similarity > 0.7 && distance < minDistance) {
        minDistance = distance;
        bestMatch = { ...guest, phone }; // Attach the phone number
      }
    });

    return { bestMatch, minDistance };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = normalizeText(name);

    // Search in both lists
    const resultKevin = searchInList(GUEST_LIST_KEVIN, normalizedInput, PHONE_KEVIN);
    const resultAzucena = searchInList(GUEST_LIST_AZUCENA, normalizedInput, PHONE_AZUCENA);

    // Determine the best match from both results
    let finalMatch = null;

    if (resultKevin.bestMatch && resultAzucena.bestMatch) {
        // If found in both (unlikely but possible with fuzzy), take the closer one
        if (resultKevin.minDistance <= resultAzucena.minDistance) {
            finalMatch = resultKevin.bestMatch;
        } else {
            finalMatch = resultAzucena.bestMatch;
        }
    } else if (resultKevin.bestMatch) {
        finalMatch = resultKevin.bestMatch;
    } else if (resultAzucena.bestMatch) {
        finalMatch = resultAzucena.bestMatch;
    }

    if (finalMatch) {
      setResult({ found: true, data: finalMatch });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#F5F5F0] rounded-sm shadow-xl max-w-lg mx-auto mt-12 font-serif border border-[#D4D4D4]">
      <h2 className="text-3xl mb-8 text-[#4A4A4A] tracking-widest uppercase font-light border-b border-[#D4D4D4] pb-4">Confirmar Asistencia</h2>
      
      {!result ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] text-center">1 Nombre y 1 Apellido</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="p-3 bg-white border border-[#E0E0E0] focus:outline-none focus:border-[#A0A0A0] text-center text-lg text-[#5A5A5A] transition-colors placeholder:text-[#C0C0C0]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#2C2C2C] text-white py-3 px-8 hover:bg-[#1A1A1A] transition-all duration-300 uppercase tracking-[0.15em] text-xs font-medium mt-2"
          >
            Buscar Invitación
          </button>
        </form>
      ) : (
        <div className="text-center w-full animate-fadeIn transition-all duration-500">
          {result.found ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-[#8A8A8A] mb-2">Bienvenido</p>
                <p className="text-2xl text-[#2C2C2C] font-light italic">{result.data?.name}</p>
              </div>
              
              <div className="py-6 border-y border-[#E0E0E0] my-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-3">Hemos reservado</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-light text-[#2C2C2C]">{result.data?.tickets}</span>
                  <span className="text-sm uppercase tracking-widest text-[#8A8A8A]">
                    {result.data?.tickets === 1 ? 'Lugar' : 'Lugares'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button
                    className="bg-[#4A7c59] text-white py-3 px-6 hover:bg-[#3A6c49] transition-colors w-full uppercase tracking-widest text-xs font-medium flex items-center justify-center gap-3"
                    onClick={() => {
                        const message = `Hola, soy ${result.data?.name} y confirmo mi asistencia a la boda.`;
                        // Fallback phone provided in code or previous steps if data is missing, but here we require it in data.
                        const phone = result.data?.phone || '529934010672'; 
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                 >
                    <span>Confirmar por WhatsApp</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </button>
                  
                
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-[#B91C1C] font-light">No encontramos una invitación con ese nombre.</p>
              <button 
                onClick={() => setResult(null)}
                className="bg-[#2C2C2C] text-white py-3 px-8 hover:bg-[#1A1A1A] transition-colors uppercase tracking-[0.15em] text-xs font-medium"
              >
                Intentar nuevamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

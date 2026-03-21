const SHEET_URL = "https://docs.google.com/spreadsheets/d/1wwACbax22pcvBaxE0RInGRymuCFno9N9sMOgBmLDXdw/gviz/tq?tqx=out:json";

// 🧼 Normalizador
export function normalizarCategoria(cat) {
  if (!cat) return "";

  return String(cat)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export async function getProducts() {
  // 1. Forzamos a Google y Vercel a no usar caché con un timestamp
  const urlConTimestamp = `${SHEET_URL}&t=${Date.now()}`;

  // 2. Fetch con configuración para que NO guarde los datos viejos
  const res = await fetch(urlConTimestamp, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  const text = await res.text();

  // 3. Extracción del JSON (usamos substring(47) como en tu original)
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  return rows.map(row => {
    const c = row.c;

    // Si la fila está totalmente vacía, la saltamos
    if (!c || !c[0]) return null;

    return {
      // VOLVEMOS A TUS ÍNDICES ORIGINALES (ID en la columna A)
      id: c[0]?.v,
      nombre: c[1]?.v ?? "",
      precio: Number(c[2]?.v) || 0,
      categoria: normalizarCategoria(c[3]?.v),
      descripcion: c[4]?.v ?? "",
      imagenes: [
        c[5]?.v, c[6]?.v, c[7]?.v, c[8]?.v, c[9]?.v,
        c[10]?.v, c[11]?.v, c[12]?.v, c[13]?.v,
      ].filter(Boolean)
    };
  }).filter(Boolean); // Limpiamos filas vacías del array
}
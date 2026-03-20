const SHEET_URL = "https://docs.google.com/spreadsheets/d/1wwACbax22pcvBaxE0RInGRymuCFno9N9sMOgBmLDXdw/gviz/tq?tqx=out:json";

// 🧼 Normalizador ROBUSTO
export function normalizarCategoria(cat) {
  if (!cat) return "";

  return String(cat)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\s+/g, " ")           // elimina espacios raros
    .trim()
    .toLowerCase();
}

export async function getProducts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  return rows.map(row => {
    const c = row.c;

    return {
      id: c[0]?.v,
      nombre: c[1]?.v,
      precio: Number(c[2]?.v) || 0,
      categoria: normalizarCategoria(c[3]?.v), // 🔥 ya normalizado
      descripcion: c[4]?.v || "",
      imagenes: [
        c[5]?.v, c[6]?.v, c[7]?.v, c[8]?.v, c[9]?.v,
        c[10]?.v, c[11]?.v, c[12]?.v, c[13]?.v,
      ].filter(Boolean)
    };
  });
}
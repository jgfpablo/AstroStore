const SHEET_URL = "https://docs.google.com/spreadsheets/d/1wwACbax22pcvBaxE0RInGRymuCFno9N9sMOgBmLDXdw/gviz/tq?tqx=out:json";

export async function getProducts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  // 🔥 Google Sheets devuelve texto raro → lo limpiamos
  const json = JSON.parse(text.substring(47).slice(0, -2));

  const rows = json.table.rows;

  return rows.map(row => {
    const c = row.c;

    return {
      id: c[0]?.v,
      nombre: c[1]?.v,
      precio: Number(c[2]?.v) || 0,

      // ✅ CATEGORIA LIMPIA
      categoria: String(c[3]?.v || "sin categoria")
        .trim()
        .toLowerCase(),

      descripcion: String(c[4]?.v || ""),

      // ✅ ARRAY DE IMAGENES
      imagenes: [
        c[5]?.v,
        c[6]?.v,
        c[7]?.v,
        c[8]?.v,
        c[9]?.v,
        c[10]?.v,
        c[11]?.v,
        c[12]?.v,
        c[13]?.v,
      ].filter(img => img && img !== "")
    };
  });
}
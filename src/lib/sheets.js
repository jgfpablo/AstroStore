const SHEET_URL = "https://docs.google.com/spreadsheets/d/1wwACbax22pcvBaxE0RInGRymuCFno9N9sMOgBmLDXdw/gviz/tq?tqx=out:json";

export async function getProducts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  // limpiar respuesta
  const json = JSON.parse(text.substring(47).slice(0, -2));

  const rows = json.table.rows;

  return rows.map((row) => {
    const c = row.c;

    return {
      id: c[0]?.v,
      nombre: c[1]?.v,
      precio: c[2]?.v,
      descripcion: c[3]?.v,
      imagenes: [
        c[4]?.v, c[5]?.v, c[6]?.v, c[7]?.v, c[8]?.v,
        c[9]?.v, c[10]?.v, c[11]?.v, c[12]?.v, c[13]?.v
      ].filter(Boolean)
    };
  });
}
export function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp));
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
}

// Exemplo de uso
// const timestamp = 1704067200000;
// const formattedDate = formatDate(timestamp);
// console.log(formattedDate);

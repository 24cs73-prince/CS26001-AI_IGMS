/**
 * Reusable CSV export utility for AI-IGMS management tables.
 * Safely formats strings with commas/quotes and triggers browser file download.
 *
 * @param {string} filename - Output filename (e.g., 'students_export.csv')
 * @param {Array<string>} headers - Header row column names
 * @param {Array<Array<any>>} rows - Data rows matching header order
 */
export function exportToCSV(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    alert("No records available to export.");
    return false;
  }

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [];
  csvRows.push(headers.map(escapeCell).join(","));

  for (const row of rows) {
    csvRows.push(row.map(escapeCell).join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\n"); // Add BOM for Excel UTF-8 support
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

// Helper utilities for renderer pages
export function formatDateDisplay(d) {
  if (!d) return '';
  let s = d.toString().trim();

  // If already in desired format like "02 JUL 25" -> return uppercase
  if (/^\d{1,2}\s+[A-Za-z]{3}\s+\d{2}$/.test(s)) return s.toUpperCase();

  // ISO date (YYYY-MM-DD...) -> extract date part
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  let date;
  if (isoMatch) {
    // Use UTC to avoid timezone shifts
    date = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00Z`);
  } else {
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) date = new Date(parsed);
    else return s.toUpperCase();
  }

  const dd = String(date.getUTCDate()).padStart(2, '0');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const mon = months[date.getUTCMonth()];
  const yy = String(date.getUTCFullYear()).slice(-2);

  return `${dd} ${mon} ${yy}`;
}

export default formatDateDisplay;

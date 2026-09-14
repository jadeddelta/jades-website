/** 
 * alpha mask that removes the dot field from under the ribbon by blurring
 * it from within the mask. 
 */
export function dotMaskUrl(ribbon: string, width: number, height: number): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><filter id="b" x="-15%" y="-4%" width="130%" height="108%"><feGaussianBlur stdDeviation="18"/></filter>` +
    `<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">` +
    `<rect width="${width}" height="${height}" fill="#fff"/>` +
    `<polygon points="${ribbon}" fill="#000" filter="url(#b)"/>` +
    `</mask></defs><rect width="${width}" height="${height}" fill="#fff" mask="url(#m)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

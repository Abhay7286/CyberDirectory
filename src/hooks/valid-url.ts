export function getValidUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    // If URL already has protocol, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url); // Validate URL
      return url;
    }
    
    // Add https if missing
    const httpsUrl = `https://${url}`;
    new URL(httpsUrl); // Validate URL
    return httpsUrl;
  } catch {
    return null;
  }
}
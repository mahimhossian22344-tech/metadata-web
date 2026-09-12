import { StockFileItem, PlatformId } from '../types';

export function generateStockCSV(items: StockFileItem[], platform: PlatformId): string {
  if (platform === 'pngplatform') {
    // PNG Platform / Pngtree CSV Format
    const headers = [
      'Filename',
      'Title',
      'Main Keywords',
      'Secondary Keywords',
      'Keywords used to create the image',
      'AI platform name',
    ];
    const rows = items.map((item) => {
      const filename = escapeCSV(item.filename);
      const title = escapeCSV(item.title || item.filename.replace(/\.[^/.]+$/, ''));
      const mainKw = escapeCSV((item.pngData?.mainKeywords || item.keywords.slice(0, 3)).join(', '));
      const secKw = escapeCSV(
        (item.pngData?.secondaryKeywords || item.keywords.slice(3, 23)).join(', ')
      );
      const prompt = escapeCSV(
        item.pngData?.promptKeywords ||
          item.description ||
          `${item.title}, high detail, 8k render, commercial stock quality`
      );
      const aiPlatform = escapeCSV(item.pngData?.aiPlatformName || 'Midjourney');

      return `${filename},${title},${mainKw},${secKw},${prompt},${aiPlatform}`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (platform === 'adobestock') {
    // Adobe Stock CSV Format: Filename,Title,Keywords,Category
    const headers = ['Filename', 'Title', 'Keywords', 'Category'];
    const rows = items.map((item) => {
      const filename = escapeCSV(item.filename);
      const title = escapeCSV(item.title || item.filename.replace(/\.[^/.]+$/, ''));
      const keywords = escapeCSV(item.keywords.join(', '));
      const category = escapeCSV(item.category || '1'); // Default Adobe Stock category ID or text
      return `${filename},${title},${keywords},${category}`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (platform === 'shutterstock') {
    // Shutterstock CSV Format: Filename,Description,Keywords,Categories,Editorial,Mature
    const headers = ['Filename', 'Description', 'Keywords', 'Categories', 'Editorial', 'Mature'];
    const rows = items.map((item) => {
      const filename = escapeCSV(item.filename);
      const desc = escapeCSV(item.description || item.title || item.filename.replace(/\.[^/.]+$/, ''));
      const keywords = escapeCSV(item.keywords.join(', '));
      const categories = escapeCSV(item.category || 'Backgrounds/Textures');
      return `${filename},${desc},${keywords},${categories},no,no`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (platform === 'freepik') {
    // Freepik CSV Format: File name,Title,Keywords,Tags
    const headers = ['File name', 'Title', 'Keywords'];
    const rows = items.map((item) => {
      const filename = escapeCSV(item.filename);
      const title = escapeCSV(item.title || item.filename.replace(/\.[^/.]+$/, ''));
      const keywords = escapeCSV(item.keywords.join(', '));
      return `${filename},${title},${keywords}`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  // Universal CSV format
  const headers = ['Filename', 'Title', 'Description', 'Keywords', 'Category', 'Keyword Count'];
  const rows = items.map((item) => {
    const filename = escapeCSV(item.filename);
    const title = escapeCSV(item.title);
    const desc = escapeCSV(item.description);
    const keywords = escapeCSV(item.keywords.join(', '));
    const cat = escapeCSV(item.category || 'General');
    return `${filename},${title},${desc},${keywords},${cat},${item.keywords.length}`;
  });
  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(field: string): string {
  if (!field) return '""';
  // Replace quotes with double quotes
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

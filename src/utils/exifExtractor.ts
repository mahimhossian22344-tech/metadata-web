import exifr from 'exifr';

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  width?: number;
  height?: number;
}

export async function extractFileMetadata(file: File): Promise<ExtractedMetadata> {
  try {
    // Only attempt EXIF/IPTC/XMP parsing on supported image formats
    if (!file.type.startsWith('image/')) {
      return {};
    }

    // Parse IPTC, XMP, and EXIF tags using exifr
    const parsed = await exifr.parse(file, {
      iptc: true,
      xmp: true,
      exif: true,
      tiff: true,
      mergeOutput: true,
    });

    if (!parsed) {
      return {};
    }

    // Extract Title (IPTC ObjectName, headline, or XMP title)
    let title: string | undefined = undefined;
    if (typeof parsed.ObjectName === 'string' && parsed.ObjectName.trim()) {
      title = parsed.ObjectName.trim();
    } else if (typeof parsed.headline === 'string' && parsed.headline.trim()) {
      title = parsed.headline.trim();
    } else if (typeof parsed.title === 'string' && parsed.title.trim()) {
      title = parsed.title.trim();
    } else if (typeof parsed.ImageDescription === 'string' && parsed.ImageDescription.trim()) {
      title = parsed.ImageDescription.trim();
    }

    // Extract Description
    let description: string | undefined = undefined;
    if (typeof parsed.caption === 'string' && parsed.caption.trim()) {
      description = parsed.caption.trim();
    } else if (typeof parsed.description === 'string' && parsed.description.trim()) {
      description = parsed.description.trim();
    } else if (typeof parsed.ImageDescription === 'string' && parsed.ImageDescription.trim()) {
      description = parsed.ImageDescription.trim();
    }

    // Extract Keywords (can be array or comma-separated string)
    let keywords: string[] = [];
    if (Array.isArray(parsed.Keywords)) {
      keywords = parsed.Keywords.map((k: any) => String(k).trim()).filter(Boolean);
    } else if (typeof parsed.Keywords === 'string') {
      keywords = parsed.Keywords.split(/[,;]+/).map((k) => k.trim()).filter(Boolean);
    } else if (Array.isArray(parsed.subject)) {
      keywords = parsed.subject.map((k: any) => String(k).trim()).filter(Boolean);
    }

    const width = parsed.ImageWidth || parsed.ExifImageWidth;
    const height = parsed.ImageHeight || parsed.ExifImageHeight;

    return {
      title,
      description,
      keywords,
      width,
      height,
    };
  } catch (err) {
    console.warn('Metadata extraction skipped or unsupported for file:', file.name, err);
    return {};
  }
}

export interface UploadResult {
  url: string;
  type: 'image' | 'video' | 'pdf';
}

export async function uploadMedia(
  file: File,
  folder: 'portraits' | 'portfolio'
): Promise<UploadResult | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Upload error:', error);
      return null;
    }

    const data = await response.json();
    return { url: data.url, type: data.type || 'image' };
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
}

// Legacy function for backwards compatibility
export async function uploadImage(
  file: File,
  folder: 'portraits' | 'portfolio'
): Promise<string | null> {
  const result = await uploadMedia(file, folder);
  return result?.url || null;
}

export async function deleteImage(url: string): Promise<boolean> {
  // Delete functionality can be added via API route if needed
  // For now, images are not deleted to avoid orphaned references
  console.log('Delete image:', url);
  return true;
}

// Helper to detect media type from URL
export function getMediaType(url: string): 'image' | 'video' | 'pdf' {
  const lowerUrl = url.toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video';
  if (lowerUrl.includes('.pdf')) return 'pdf';
  return 'image';
}

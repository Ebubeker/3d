import { createClient } from './client';

export interface UploadResult {
  url: string;
  type: 'image' | 'video' | 'pdf';
}

export async function uploadMedia(
  file: File,
  folder: 'portraits' | 'portfolio' | 'blog' | string
): Promise<UploadResult | null> {
  try {
    const isVideo = file.type.startsWith('video/');
    const isPdf = file.type === 'application/pdf';
    const bucket = isVideo ? 'videos' : 'images';
    const fileType: 'image' | 'video' | 'pdf' = isVideo ? 'video' : isPdf ? 'pdf' : 'image';

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, type: fileType };
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
export function getMediaType(url: string): 'image' | 'video' | 'pdf' | 'link' {
  // Check for link entries (JSON-encoded objects)
  try {
    const parsed = JSON.parse(url);
    if (parsed && typeof parsed === 'object' && 'link' in parsed && 'type' in parsed) {
      return parsed.type === 'link' ? 'link' : parsed.type;
    }
  } catch {
    // Not a link entry, continue with extension-based detection
  }

  const lowerUrl = url.toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video';
  if (lowerUrl.includes('.pdf')) return 'pdf';
  return 'image';
}

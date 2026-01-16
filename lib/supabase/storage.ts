export async function uploadImage(
  file: File,
  folder: 'portraits' | 'portfolio'
): Promise<string | null> {
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
    return data.url;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  // Delete functionality can be added via API route if needed
  // For now, images are not deleted to avoid orphaned references
  console.log('Delete image:', url);
  return true;
}

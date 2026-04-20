import { Camera, CameraResultType } from '@capacitor/camera';
import imageCompression from 'browser-image-compression';

import { newGuid } from './identifier';
import { FileStructure } from '../types/files/temporary-files';

export const getBase64Image = (img: any) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg');
};

export const getBase64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      }

      reject(null);
    };
    reader.readAsDataURL(file);
  });
};

export const getBlobImage = async (base64: string) => {
  return await fetch(base64).then(async res => await compressImage(await res.blob(), 1));
};

export const compressFile = async (file: File, maxSizeMB: number): Promise<File> => {
  return await imageCompression(file, {
    maxSizeMB,
    useWebWorker: true,
  });
};

export const compressImage = async (blob: Blob, maxSizeMB: number): Promise<Blob> => {
  const file = new File([blob], 'image.jpg', { type: blob.type || 'image/jpeg' });
  return imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
};

export const downloadFile = (url: string) => {
  window.open('https://docs.google.com/a/google.com/viewer?url=' + url + '&embedded=false');
};

export const takeImage = async (): Promise<FileStructure | undefined> => {
  const image = await Camera.getPhoto({
    quality: 50,
    saveToGallery: true,
    resultType: CameraResultType.Uri,
  });

  const fileObj = await pathToFile(image);
  if (!fileObj) {
    return;
  }

  return { file: fileObj, localUrl: image.webPath || null };
};

export const picImages = async (): Promise<FileStructure[]> => {
  const gallery = await Camera.pickImages({
    quality: 50,
    limit: 10,
  });

  const BATCH_SIZE = 8;
  const results: FileStructure[] = [];

  for (let i = 0; i < gallery.photos.length; i += BATCH_SIZE) {
    const batch = gallery.photos.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async pic => {
        const picCopy = { ...pic };
        const file = await pathToFile(picCopy);
        return { file, localUrl: picCopy.webPath || null };
      })
    );
    results.push(...batchResults);
  }

  return results.filter(result => result.file !== null);
};

export const pathToFile = async (pic: { webPath?: string; format: string }): Promise<File | null> => {
  if (!pic.webPath) return null;

  const response = await fetch(pic.webPath);
  const blob = await compressImage(await response.blob(), 1);

  return new File([blob], newGuid(), { type: 'image/' + pic.format });
};

/**
 * Calculates the proper height of an image with a custom width, preserving the original aspect ratio.
 *
 * @param originalHeight
 * @param originalWidth
 * @param newWidth
 */
export const determineNewHeight = (originalHeight: number, originalWidth: number, newWidth: number) => {
  return (originalHeight / originalWidth) * newWidth;
};

/**
 * Calculates the proper width of an image with a custom height, preserving the original aspect ratio.
 *
 * @param originalWidth
 * @param originalHeight
 * @param newWidth
 */
export const determineNewWidth = (originalWidth: number, originalHeight: number, newHeight: number) => {
  return (originalWidth / originalHeight) * newHeight;
};

/**
 * Calculates the proper height of an image with a custom width, preserving the original aspect ratio.
 *
 * @param originalHeight
 * @param originalWidth
 * @param newWidth
 */
export const determineNewSize = (
  originalHeight: number,
  originalWidth: number,
  newWidth: number,
  newHeight: number
): { width: number; height: number } => {
  if (newHeight < originalHeight || newWidth < originalWidth) {
    var ratio = Math.min(newWidth / originalWidth, newHeight / originalHeight);

    return { width: originalWidth * ratio, height: originalHeight * ratio };
  }

  return { width: originalWidth, height: originalHeight };
};

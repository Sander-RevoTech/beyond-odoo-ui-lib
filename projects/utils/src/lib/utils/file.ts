import { Camera, CameraResultType } from '@capacitor/camera';
import Compressor from 'compressorjs';

import { newGuid } from './identifier';

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
  return await fetch(base64).then(res => res.blob());
};

export const compressImage = async (blob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(blob, {
      quality: 0.1,
      success: (blob: Blob) => {
        resolve(blob);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const downloadFile = (url: string) => {
  window.open('https://docs.google.com/a/google.com/viewer?url=' + url + '&embedded=false');
};

export const takeImage = async () => {
  const image = await Camera.getPhoto({
    quality: 30,
    allowEditing: true,
    saveToGallery: true,
    resultType: CameraResultType.Uri,
  });

  const file = {
    file: await pathToFile(image),
    localUrl: image.webPath || null,
  };
  if (!file.file) {
    return;
  }

  return file;
};

export const picImages = async () => {
  const gallery = await Camera.pickImages({
    quality: 30,
  });

  const pics = [];
  for (let pic of gallery.photos) {
    const file = {
      file: await pathToFile(pic),
      localUrl: pic.webPath,
    };

    if (!file.file) {
      continue;
    }
    pics.push(file);
  }

  return pics;
};

export const pathToFile = async (pic: { webPath?: string; format: string }): Promise<File | null> => {
  if (!pic.webPath) return null;

  const response = await fetch(pic.webPath);
  const blob = await compressImage(await response.blob());

  return new File([blob], newGuid(), { type: pic.format });
};

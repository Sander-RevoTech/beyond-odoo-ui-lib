import { Camera, CameraResultType } from '@capacitor/camera';
import imageCompression from 'browser-image-compression';
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

export const compressFile = async (file: File, maxSizeMB: number): Promise<File> => {
  return await imageCompression(file, {
    maxSizeMB,
    useWebWorker: true,
  });
};
export const compressImage = async (blob: Blob, maxSizeMB: number): Promise<Blob> => {
  console.log('Original Blob size:', blob.size / 1024 / 1024, 'MB');
  return new Promise(resolve => {
    // Calculer la taille du blob en Mo
    const sizeMB = blob.size / 1024 / 1024;
    console.log('Blob size in MB:', sizeMB);
    // Déterminer une qualité de départ en fonction de la taille
    // Exemple : qualité plus basse si l’image est très grande
    // (adaptable selon vos besoins)
    let quality = 0.9;
    if (sizeMB > maxSizeMB * 8) {
      quality = 0.2;
    } else if (sizeMB > maxSizeMB * 4) {
      quality = 0.4;
    } else if (sizeMB > maxSizeMB * 2) {
      quality = 0.6;
    } else if (sizeMB > maxSizeMB * 1.1) {
      quality = 0.8;
    }
    console.log('Starting compression with quality:', quality);

    const tryCompress = () => {
      console.log('Trying compression with quality:', quality);
      new Compressor(blob, {
        quality,
        success(result) {
          if (result.size / 1024 / 1024 <= maxSizeMB || quality < 0.1) {
            console.log('Compressed Blob size:', result.size / 1024 / 1024, 'MB');
            resolve(result);
          } else {
            console.log('Result too large, reducing quality and retrying...');
            quality -= 0.1;
            tryCompress();
          }
        },
      });
    };

    tryCompress();
  });
};

export const downloadFile = (url: string) => {
  window.open('https://docs.google.com/a/google.com/viewer?url=' + url + '&embedded=false');
};

export const takeImage = async () => {
  const image = await Camera.getPhoto({
    quality: 50,
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
    quality: 50,
    limit: 10,
  });

  console.log('gallery', gallery);
  
  const filePromises = gallery.photos.map(async (pic) => {
    const file = await pathToFile(pic);
    return {
      file,
      localUrl: pic.webPath,
    };
  });

  const results = await Promise.all(filePromises);
  const pics = results.filter(result => result.file !== null);
  
  console.log('pics', pics);
  return pics;
};

export const pathToFile = async (pic: { webPath?: string; format: string }): Promise<File | null> => {
  console.log('pathToFile', pic);
  if (!pic.webPath) return null;

  console.log('fetching image');
  const response = await fetch(pic.webPath);
  console.log('fetched image');
  const blob = await compressImage(await response.blob(), 1); // TODO: add the max size in a config later
  console.log('compressed image');

  return new File([blob], newGuid(), { type: pic.format });
};

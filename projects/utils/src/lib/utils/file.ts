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
    if (sizeMB > maxSizeMB * 4) {
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
    quality: 60,
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
    quality: 60,
    limit: 10,
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
  return await compressFile(new File([await response.blob()], newGuid()), 1); // TODO: add the max size in a config later
};

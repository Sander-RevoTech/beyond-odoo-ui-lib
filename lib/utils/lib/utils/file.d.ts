export declare const getBase64Image: (img: any) => string;
export declare const getBase64FromFile: (file: File) => Promise<string>;
export declare const getBlobImage: (base64: string) => Promise<Blob>;
export declare const compressImage: (blob: Blob) => Promise<Blob>;
export declare const downloadFile: (url: string) => void;
export declare const takeImage: () => Promise<{
    file: File | null;
    localUrl: string | null;
} | undefined>;
export declare const picImages: () => Promise<{
    file: File | null;
    localUrl: string;
}[]>;
export declare const pathToFile: (pic: {
    webPath?: string;
    format: string;
}) => Promise<File | null>;

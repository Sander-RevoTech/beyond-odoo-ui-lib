export type RecursivePartial<T> = {
  [P in keyof T]?: any; // RecursivePartial<T[P]>;
};

export type MessageLevel = 'danger' | 'info' | 'warning' | 'success';

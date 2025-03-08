export const call = (phoneNumber: string) => {
  window.open(`tel:${phoneNumber}`);
};

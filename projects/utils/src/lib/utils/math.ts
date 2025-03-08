export const createRange = (number: number) => {
  return new Array(number).fill(0).map((n, index) => index + 1);
};

export const roundToDecimal = (number: number, precision: number) => {
  return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const percentage = (partialValue: number, totalValue: number) => {
  return (100 * partialValue) / totalValue;
};

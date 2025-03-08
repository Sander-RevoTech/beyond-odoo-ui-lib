export const extractEnum = (allEnum: any, backendOne = false): { value: number; name: string }[] => {
  const keys = Object.keys(allEnum).filter(k => typeof allEnum[k as any] === 'number');
  return keys
    .map(key => {
      return { value: allEnum[key], name: key };
    })
    .filter(item => (backendOne ? item.value !== 0 : true));
};

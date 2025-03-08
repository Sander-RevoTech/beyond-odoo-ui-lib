export const compare = (a: any, b: any, isAsc: boolean) => {
  let compare = 0;

  if (!a) {
    compare = 1;
  } else if (!b) {
    compare = -1;
  } else {
    compare = a < b ? -1 : 1;
  }

  return compare * (isAsc ? 1 : -1);
};
export const compareHour = (a: Date, b: Date, isAsc: boolean) => {
  if (a.getHours() === b.getHours()) {
    if (a.getMinutes() === b.getMinutes()) {
      if (a.getSeconds() === b.getSeconds()) {
        return 0;
      }
      return (a.getSeconds() - b.getSeconds()) * (isAsc ? 1 : -1);
    }
    return (a.getMinutes() - b.getMinutes()) * (isAsc ? 1 : -1);
  }
  return (a.getHours() - b.getHours()) * (isAsc ? 1 : -1);
};

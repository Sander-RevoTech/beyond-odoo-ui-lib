export enum EToast {
  none,
  error,
  warning,
  information,
  success,
}

export const getTypeClass = (code: EToast) => {
  if (code === EToast.error) {
    return 'danger';
  } else if (code === EToast.warning) {
    return 'warning';
  } else if (code === EToast.information) {
    return 'info';
  } else if (code === EToast.success) {
    return 'success';
  } else {
    return '';
  }
};

export const copyTextToClipboard = async (
  text: string,
  success: (message: string) => void,
  error: (message: string) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    success('utils.clipboard.success');
  } catch (err) {
    error('utils.clipboard.error');
  }
};

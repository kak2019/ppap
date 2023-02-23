export const returnToSource = (sourceUrl: string): void => {
  if (sourceUrl.length > 0)
    document.location.href = decodeURIComponent(sourceUrl);
};
export const dispToEdit = (): void => {
  document.location.href = document.location.href + "&EditMode=yes";
};

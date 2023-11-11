export const getMimeFile = (fileBase64: string) => {
  let arr = fileBase64.split(",");
  return arr[0].match(/:(.*?);/)![1];
};

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string
) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
};

const FILES_PATH = "/mypreflight-files";

export function postcardArtUrl(imageUrl: string): string {
  if (!import.meta.env.DEV) {
    return imageUrl;
  }

  const filesAt = imageUrl.indexOf(FILES_PATH);

  return filesAt === -1 ? imageUrl : imageUrl.slice(filesAt);
}

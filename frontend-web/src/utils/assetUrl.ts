export function resolveAssetUrl(assetPath?: string | null): string {
  if (!assetPath) return '';

  if (/^(https?:|data:|blob:)/.test(assetPath)) {
    return assetPath;
  }

  if (!assetPath.startsWith('/projectImg/')) {
    return assetPath;
  }

  const apiBase = (import.meta as any).env.VITE_API_URL as string | undefined;
  if (!apiBase) {
    return assetPath;
  }

  return `${apiBase.replace(/\/$/, '')}${assetPath}`;
}
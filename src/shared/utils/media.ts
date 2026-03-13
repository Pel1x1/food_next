import { mediaUrls } from '@/shared/config/api';
import type { RecipeImage } from '@/shared/entity/recipe';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400/eee/ccc?text=No+Image';
export const MAIN_FALLBACK_IMAGE = 'https://via.placeholder.com/800x400/eee/ccc?text=No+Image';

export const buildMediaUrl = (
  rawUrl: string | null | undefined, 
  fallback = FALLBACK_IMAGE
): string => {
  if (!rawUrl) {
    return fallback;
  }

  if (rawUrl.startsWith('http')) {
    return rawUrl;
  }

  return `${mediaUrls.base}/${rawUrl.replace(/^\/+/, '')}`;
};

export const getRecipeImageUrl = (
  images?: RecipeImage[] | null,
): string => {
  if (!images || images.length === 0) {
    return FALLBACK_IMAGE;
  }

  const first = images[0];
  const rawUrl =
    first.formats?.small?.url ||
    first.formats?.medium?.url ||
    first.url ||
    '';

  return buildMediaUrl(rawUrl, FALLBACK_IMAGE);
};

export const getRecipeMainImageUrl = (
  images?: RecipeImage[] | null,
): string => {
  if (!images || images.length === 0) {
    return MAIN_FALLBACK_IMAGE;
  }

  const first = images[0];
  const rawUrl =
    first.formats?.medium?.url ||
    first.formats?.small?.url ||
    first.url ||
    '';

  return buildMediaUrl(rawUrl, MAIN_FALLBACK_IMAGE);
};

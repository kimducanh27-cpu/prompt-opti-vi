import type { FavoritePrompt } from '@prompt-optimizer/core'

export type FavoriteMediaMetadata = {
  coverAssetId?: string
  coverUrl?: string
  assetIds: string[]
  urls: string[]
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const asTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const next = value.trim()
  return next || undefined
}

const dedupeStrings = (items: string[]): string[] => {
  return Array.from(new Set(items.filter(Boolean)))
}

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

// SEC-001: metadata-supplied image URLs come from stored / imported data, so
// only `https:` (and `blob:`) URLs are trusted — validated at PARSE time, not
// at render time. `data:` stays banned (the deliberate ban in core
// storage-guards). Asset IDs are NOT URLs: they resolve at render into
// app-generated `data:` URLs via resolveAssetIdToDataUrl and must NOT be
// filtered here.
export const isAllowedExternalImageUrl = (value: string | undefined): value is string => {
  if (!value) return false
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  return url.protocol === 'https:' || url.protocol === 'blob:'
}

const asAllowedExternalImageUrl = (value: unknown): string | undefined => {
  const next = asTrimmedString(value)
  return isAllowedExternalImageUrl(next) ? next : undefined
}

const asAllowedExternalImageUrlArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return dedupeStrings(value.map((item) => asAllowedExternalImageUrl(item) ?? ''))
}

export const parseFavoriteMediaMetadata = (
  favorite: FavoritePrompt | null | undefined,
): FavoriteMediaMetadata | null => {
  if (!favorite || !isRecord(favorite.metadata)) return null
  const rawMedia = favorite.metadata.media
  if (!isRecord(rawMedia)) return null

  const coverAssetId = asTrimmedString(rawMedia.coverAssetId)
  const coverUrl = asAllowedExternalImageUrl(rawMedia.coverUrl)
  const assetIds = dedupeStrings(asStringArray(rawMedia.assetIds))
  const urls = asAllowedExternalImageUrlArray(rawMedia.urls)

  if (!coverAssetId && !coverUrl && assetIds.length === 0 && urls.length === 0) {
    return null
  }

  return {
    coverAssetId,
    coverUrl,
    assetIds,
    urls,
  }
}

export const buildFavoriteMediaMetadata = (input: {
  coverAssetId?: string
  coverUrl?: string
  assetIds?: string[]
  urls?: string[]
}): FavoriteMediaMetadata | null => {
  const coverAssetId = asTrimmedString(input.coverAssetId)
  // SEC-001: same parse-time allowlist as parseFavoriteMediaMetadata — this
  // is the construction point for editor-typed and garden-imported URLs.
  const coverUrl = asAllowedExternalImageUrl(input.coverUrl)
  const assetIds = dedupeStrings(asStringArray(input.assetIds))
  const urls = asAllowedExternalImageUrlArray(input.urls)

  if (!coverAssetId && !coverUrl && assetIds.length === 0 && urls.length === 0) {
    return null
  }

  return {
    coverAssetId,
    coverUrl,
    assetIds,
    urls,
  }
}

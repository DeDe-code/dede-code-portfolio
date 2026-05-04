/**
 * Converts a display title to a URL/filesystem-safe slug.
 * Removes diacritics, special characters, and collapses hyphens.
 * Must stay in sync with how image directories are named.
 */
export function slugifyTitle(title: string): string {
  // Pre-map characters that don't decompose via NFD
  const charMap: Record<string, string> = {
    ł: "l",
    Ł: "l",
    ø: "o",
    Ø: "o",
    ß: "ss",
    æ: "ae",
    Æ: "ae",
    đ: "d",
    Đ: "d",
  };
  const mapped = title.replace(/[łŁøØßæÆđĐ]/g, (c) => charMap[c] ?? c);
  return mapped
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[_]/g, "-") // underscore → hyphen
    .replace(/[^a-z0-9\s-]/g, "") // remove remaining special chars
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse consecutive hyphens
}

/**
 * Returns sequential image paths for a theater show.
 * Images live at: /image/theater/shows/{slug}/image-{n}.jpg
 */
export function useShowImages(title: string, count: number): string[] {
  const slug = slugifyTitle(title);
  return Array.from(
    { length: count },
    (_, i) => `theater/shows/${slug}/image-${i + 1}.jpg`,
  );
}

/**
 * Returns sequential image paths for a theater film.
 * Images live at: theater/films/{slug}/image-{n}.jpg
 */
export function useFilmImages(title: string, count: number): string[] {
  const slug = slugifyTitle(title);
  return Array.from(
    { length: count },
    (_, i) => `theater/films/${slug}/image-${i + 1}.jpg`,
  );
}

/**
 * Returns sequential image paths for a code project.
 * Images live at: code/projects/{slug}/image-{n}.{ext}
 */
export function useProjectImages(
  title: string,
  count: number,
  ext = "jpg",
): string[] {
  const slug = slugifyTitle(title);
  return Array.from(
    { length: count },
    (_, i) => `code/projects/${slug}/image-${i + 1}.${ext}`,
  );
}

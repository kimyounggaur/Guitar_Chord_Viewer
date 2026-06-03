import type { ChordQualityId } from '../data/chordTypes';

const qualityFolders: Record<ChordQualityId, string> = {
  major: 'major',
  dominant7: 'dominant7',
  minor: 'minor',
  minor7: 'minor7',
  sus4: 'sus4',
  major7: 'major7',
  six: 'six',
  sevenSus4: 'seven-sus4',
  add2: 'add2',
  m7b5: 'm7b5',
  diminish: 'diminish',
  augment: 'augment',
};

export function slugRoot(root: string): string {
  return root
    .trim()
    .replace(/#/g, '-sharp-')
    .replace(/([A-Ga-g])b/g, '$1-flat-')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function qualityAssetSlug(quality: ChordQualityId): string {
  return qualityFolders[quality];
}

export function chordImagePath(quality: ChordQualityId, root: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}chords/${qualityAssetSlug(quality)}/${slugRoot(root)}.png`;
}

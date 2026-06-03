import type { ChordQualityId, ChordShape } from '../data/chordTypes';

export type ChordSearchOptions = {
  searchTerm: string;
  selectedQuality: ChordQualityId | null;
};

export function searchChords(chords: ChordShape[], options: ChordSearchOptions): ChordShape[] {
  const normalizedTerm = options.searchTerm.trim().toLowerCase();

  return chords.filter((chord) => {
    const qualityMatches = options.selectedQuality ? chord.quality === options.selectedQuality : true;
    if (!qualityMatches) {
      return false;
    }

    if (!normalizedTerm) {
      return true;
    }

    const searchable = [chord.title, chord.root, chord.quality, ...(chord.tags ?? [])].map((value) => value.toLowerCase());
    return searchable.some((value) => value.includes(normalizedTerm));
  });
}

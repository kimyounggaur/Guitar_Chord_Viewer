import { describe, expect, it } from 'vitest';
import { chordImagePath, qualityAssetSlug, slugRoot } from './slug';

describe('slug helpers', () => {
  it('normalizes roots for static chord image paths', () => {
    expect(slugRoot('C')).toBe('c');
    expect(slugRoot('C#')).toBe('c-sharp');
    expect(slugRoot('Bb')).toBe('b-flat');
    expect(slugRoot('F#m')).toBe('f-sharp-m');
  });

  it('maps app quality ids to stable public asset folders', () => {
    expect(qualityAssetSlug('major')).toBe('major');
    expect(qualityAssetSlug('dominant7')).toBe('dominant7');
    expect(qualityAssetSlug('major7')).toBe('major7');
    expect(qualityAssetSlug('sevenSus4')).toBe('seven-sus4');
  });

  it('builds public image paths using normalized quality and root slugs', () => {
    expect(chordImagePath('major7', 'F#')).toBe(`${import.meta.env.BASE_URL}chords/major7/f-sharp.png`);
  });
});

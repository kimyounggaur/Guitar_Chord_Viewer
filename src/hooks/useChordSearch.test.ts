import { describe, expect, it } from 'vitest';
import type { ChordShape } from '../data/chordTypes';
import { searchChords } from './useChordSearch';

const fixtures: ChordShape[] = [
  {
    id: 'c_major',
    root: 'C',
    quality: 'major',
    title: 'C Major',
    positions: [],
    tags: ['open chord', 'beginner', 'reference'],
  },
  {
    id: 'a_minor7',
    root: 'A',
    quality: 'minor7',
    title: 'A minor7',
    positions: [],
    tags: ['jazz'],
  },
  {
    id: 'g_dominant7',
    root: 'G',
    quality: 'dominant7',
    title: 'G7',
    positions: [],
    tags: ['blues', 'reference'],
  },
  {
    id: 'f_major',
    root: 'F',
    quality: 'major',
    title: 'F Major',
    positions: [],
    tags: ['reference'],
  },
  {
    id: 'f_minor7',
    root: 'F',
    quality: 'minor7',
    title: 'F minor7',
    positions: [],
    tags: ['reference'],
  },
];

describe('searchChords', () => {
  it('filters by selected quality before rendering a gallery', () => {
    expect(searchChords(fixtures, { selectedQuality: 'major', searchTerm: '' }).map((chord) => chord.id)).toEqual([
      'c_major',
      'f_major',
    ]);
  });

  it('searches title, root, quality id, and tags without case sensitivity', () => {
    expect(searchChords(fixtures, { selectedQuality: null, searchTerm: 'JAZZ' }).map((chord) => chord.id)).toEqual([
      'a_minor7',
    ]);
    expect(searchChords(fixtures, { selectedQuality: null, searchTerm: 'dominant' }).map((chord) => chord.id)).toEqual([
      'g_dominant7',
    ]);
  });

  it('treats a single note name as a root search instead of matching tags', () => {
    expect(searchChords(fixtures, { selectedQuality: null, searchTerm: 'F' }).map((chord) => chord.id)).toEqual([
      'f_major',
      'f_minor7',
    ]);
  });

  it('searches every chord when a term is entered even if a quality is selected', () => {
    expect(searchChords(fixtures, { selectedQuality: 'major', searchTerm: 'F' }).map((chord) => chord.id)).toEqual([
      'f_major',
      'f_minor7',
    ]);
  });
});

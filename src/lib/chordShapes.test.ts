import { describe, expect, it } from 'vitest';
import { createChordShape, parseChordPattern } from './chordShapes';

describe('chord shape helpers', () => {
  it('converts a 6-to-1 string pattern into explicit string positions', () => {
    expect(parseChordPattern('x32010', { 5: 3, 4: 2, 2: 1 })).toEqual([
      { string: 6, muted: true },
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 0, open: true },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 0, open: true },
    ]);
  });

  it('creates a typed chord shape with predictable id, title, tags, and image path', () => {
    expect(
      createChordShape({
        root: 'C',
        quality: 'major',
        label: 'Major',
        pattern: 'x32010',
        fingers: { 5: 3, 4: 2, 2: 1 },
        image: '/chords/major/c.png',
        tags: ['open chord'],
      }),
    ).toMatchObject({
      id: 'c_major',
      root: 'C',
      quality: 'major',
      title: 'C Major',
      image: '/chords/major/c.png',
      tags: ['open chord'],
    });
  });
});

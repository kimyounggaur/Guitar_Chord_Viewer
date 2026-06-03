import { describe, expect, it } from 'vitest';
import { fretboardImageClassName, fretboardImageFrameClassName } from './fretboardImageClass';

describe('fretboard image classes', () => {
  it('does not force real chord images into a synthetic aspect ratio', () => {
    expect(fretboardImageClassName('thumb')).not.toContain('aspect-');
    expect(fretboardImageClassName('large')).not.toContain('aspect-');
  });

  it('keeps real chord images contained inside their frame without stretching', () => {
    expect(fretboardImageClassName('thumb')).toContain('max-h-full');
    expect(fretboardImageClassName('thumb')).toContain('max-w-full');
    expect(fretboardImageClassName('thumb')).toContain('object-contain');
    expect(fretboardImageFrameClassName('large')).toContain('aspect-[3841/2713]');
  });
});

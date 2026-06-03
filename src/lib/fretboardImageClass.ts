export type FretboardImageSize = 'thumb' | 'large';

export function fretboardImageFrameClassName(size: FretboardImageSize): string {
  const base = 'relative flex aspect-[3841/2713] w-full items-center justify-center overflow-hidden';

  if (size === 'large') {
    return `${base} mx-auto max-h-[calc(100vh-230px)] max-w-6xl rounded-[8px] shadow-neumorphic`;
  }

  return `${base} rounded-[6px]`;
}

export function fretboardImageClassName(size: FretboardImageSize): string {
  const base = 'block h-auto max-h-full w-auto max-w-full object-contain';

  if (size === 'large') {
    return `${base} rounded-[8px]`;
  }

  return `${base} rounded-[6px]`;
}

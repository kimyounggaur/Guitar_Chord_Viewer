import { useCallback, useEffect, useRef } from 'react';

type AudioWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const soundTargetSelector = 'button, [data-pop-sound]';

function getAudioContextConstructor() {
  if (typeof window === 'undefined') {
    return null;
  }

  const audioWindow = window as AudioWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

export function useCuteClickSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedAtRef = useRef(0);

  const getAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) {
      return null;
    }

    audioContextRef.current = new AudioContextConstructor();
    return audioContextRef.current;
  }, []);

  const playPop = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const playedAt = window.performance.now();
    if (playedAt - lastPlayedAtRef.current < 45) {
      return;
    }

    const audioContext = getAudioContext();
    if (!audioContext) {
      return;
    }

    lastPlayedAtRef.current = playedAt;

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    const startAt = audioContext.currentTime + 0.001;
    const duration = 0.18;
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, startAt);
    masterGain.gain.exponentialRampToValueAtTime(0.075, startAt + 0.012);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    masterGain.connect(audioContext.destination);

    const popOscillator = audioContext.createOscillator();
    popOscillator.type = 'sine';
    popOscillator.frequency.setValueAtTime(720, startAt);
    popOscillator.frequency.exponentialRampToValueAtTime(1320, startAt + 0.07);
    popOscillator.frequency.exponentialRampToValueAtTime(980, startAt + duration);
    popOscillator.connect(masterGain);
    popOscillator.start(startAt);
    popOscillator.stop(startAt + duration);

    const sparkleGain = audioContext.createGain();
    sparkleGain.gain.setValueAtTime(0.0001, startAt);
    sparkleGain.gain.exponentialRampToValueAtTime(0.028, startAt + 0.018);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.12);
    sparkleGain.connect(masterGain);

    const sparkleOscillator = audioContext.createOscillator();
    sparkleOscillator.type = 'triangle';
    sparkleOscillator.frequency.setValueAtTime(1480, startAt);
    sparkleOscillator.frequency.exponentialRampToValueAtTime(2180, startAt + 0.08);
    sparkleOscillator.connect(sparkleGain);
    sparkleOscillator.start(startAt);
    sparkleOscillator.stop(startAt + 0.12);

    window.setTimeout(() => {
      masterGain.disconnect();
      sparkleGain.disconnect();
    }, 260);
  }, [getAudioContext]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const soundTarget = target?.closest(soundTargetSelector);
      if (!soundTarget) {
        return;
      }

      if (soundTarget instanceof HTMLButtonElement && soundTarget.disabled) {
        return;
      }

      playPop();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const soundTarget = target?.closest(soundTargetSelector);
      if (!soundTarget) {
        return;
      }

      if (soundTarget instanceof HTMLButtonElement && soundTarget.disabled) {
        return;
      }

      playPop();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [playPop]);
}

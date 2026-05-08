import { useCallback, useRef } from 'react';

export type SoundEvent = 'click' | 'result' | 'error';

type SoundMap = Partial<Record<SoundEvent, string>>;

// Sound assets are intentionally empty by default — the client provides them later.
// To enable: drop files into /public/sounds/ and map them here.
//   click:  '/sounds/click.mp3'
//   result: '/sounds/result.mp3'
//   error:  '/sounds/error.mp3'
const SOUND_SOURCES: SoundMap = {};

export function useSound(enabled: boolean = true) {
  const cache = useRef<Partial<Record<SoundEvent, HTMLAudioElement>>>({});

  return useCallback((event: SoundEvent) => {
    if (!enabled) return;
    const src = SOUND_SOURCES[event];
    if (!src) return;
    let audio = cache.current[event];
    if (!audio) {
      audio = new Audio(src);
      audio.preload = 'auto';
      cache.current[event] = audio;
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Autoplay may be blocked until first user gesture — safe to ignore.
    });
  }, [enabled]);
}

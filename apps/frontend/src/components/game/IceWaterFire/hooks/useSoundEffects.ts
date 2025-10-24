import {useEffect, useRef, useState} from 'react';

interface SoundEffects {
  cardSelect: HTMLAudioElement | null;
  cardReveal: HTMLAudioElement | null;
  roundWin: HTMLAudioElement | null;
  roundLose: HTMLAudioElement | null;
  roundDraw: HTMLAudioElement | null;
  gameWin: HTMLAudioElement | null;
  gameLose: HTMLAudioElement | null;
  ready: HTMLAudioElement | null;
  roomJoin: HTMLAudioElement | null;
  timerWarning: HTMLAudioElement | null;
}

export const useSoundEffects = () => {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const soundsRef = useRef<SoundEffects>({
    cardSelect: null,
    cardReveal: null,
    roundWin: null,
    roundLose: null,
    roundDraw: null,
    gameWin: null,
    gameLose: null,
    ready: null,
    roomJoin: null,
    timerWarning: null,
  });

  // Initialize sounds from localStorage
  useEffect(() => {
    const savedSoundsEnabled = localStorage.getItem('soundsEnabled');
    const savedVolume = localStorage.getItem('soundVolume');

    if (savedSoundsEnabled !== null) {
      setSoundsEnabled(savedSoundsEnabled === 'true');
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }

    // Initialize audio elements
    try {
      soundsRef.current = {
        cardSelect: new Audio('/sounds/card-select.mp3'),
        cardReveal: new Audio('/sounds/card-reveal.mp3'),
        roundWin: new Audio('/sounds/round-win.mp3'),
        roundLose: new Audio('/sounds/round-lose.mp3'),
        roundDraw: new Audio('/sounds/round-draw.mp3'),
        gameWin: new Audio('/sounds/game-win.mp3'),
        gameLose: new Audio('/sounds/game-lose.mp3'),
        ready: new Audio('/sounds/ready.mp3'),
        roomJoin: new Audio('/sounds/room-join.mp3'),
        timerWarning: new Audio('/sounds/timer-warning.mp3'),
      };

      // Set initial volume for all sounds
      Object.values(soundsRef.current).forEach((audio) => {
        if (audio) {
          audio.volume = volume;
        }
      });
    } catch (error) {
      console.warn('Failed to load sound effects:', error);
    }
  }, []);

  // Update volume when it changes
  useEffect(() => {
    localStorage.setItem('soundVolume', volume.toString());
    Object.values(soundsRef.current).forEach((audio) => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);

  // Update localStorage when soundsEnabled changes
  useEffect(() => {
    localStorage.setItem('soundsEnabled', soundsEnabled.toString());
  }, [soundsEnabled]);

  const playSound = (soundName: keyof SoundEffects) => {
    if (!soundsEnabled) return;

    const sound = soundsRef.current[soundName];
    if (sound) {
      // Reset the audio to the beginning if it's already playing
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    }
  };

  const toggleSounds = () => {
    setSoundsEnabled((prev) => !prev);
  };

  return {
    playSound,
    soundsEnabled,
    volume,
    setVolume,
    toggleSounds,
  };
};

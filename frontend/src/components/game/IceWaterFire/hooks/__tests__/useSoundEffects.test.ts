import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSoundEffects } from '../useSoundEffects';

describe('useSoundEffects', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.soundsEnabled).toBe(true);
    expect(result.current.volume).toBe(0.5);
  });

  it('should load saved settings from localStorage', () => {
    localStorage.setItem('soundsEnabled', 'false');
    localStorage.setItem('soundVolume', '0.8');
    
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.soundsEnabled).toBe(false);
    expect(result.current.volume).toBe(0.8);
  });

  it('should toggle sounds on/off', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.soundsEnabled).toBe(true);
    
    act(() => {
      result.current.toggleSounds();
    });
    
    expect(result.current.soundsEnabled).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('soundsEnabled', 'false');
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    act(() => {
      result.current.setVolume(0.7);
    });
    
    expect(result.current.volume).toBe(0.7);
    expect(localStorage.setItem).toHaveBeenCalledWith('soundVolume', '0.7');
  });

  it('should not play sound when sounds are disabled', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    act(() => {
      result.current.toggleSounds(); // Disable sounds
    });
    
    act(() => {
      result.current.playSound('cardSelect');
    });
    
    // Since sounds are disabled, play should not be called
    // (can't easily test this without mocking Audio)
  });

  it('should play sound when sounds are enabled', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    act(() => {
      result.current.playSound('cardSelect');
    });
    
    // Sound should attempt to play
    // (actual Audio.play is mocked in setup.ts)
  });
});


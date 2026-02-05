import { renderHook, act } from '@testing-library/react';
import { useOS } from '../../../src/core/hooks/useOS';
import { describe, it, expect } from 'vitest';

describe('useOS', () => {
  it('starts with no open windows', () => {
    const { result } = renderHook(() => useOS());
    expect(result.current.openWindows).toEqual([]);
  });

  it('opens a window', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
    });
    expect(result.current.openWindows).toHaveLength(1);
    expect(result.current.openWindows[0].id).toBe('sticky-notes');
  });

  it('closes a window', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
      result.current.closeWindow('sticky-notes');
    });
    expect(result.current.openWindows).toHaveLength(0);
  });

  it('focuses a window when opened', () => {
    const { result } = renderHook(() => useOS());
    act(() => {
      result.current.openWindow('sticky-notes');
      result.current.openWindow('team-mood');
    });
    const focused = result.current.openWindows.find(w => w.isFocused);
    expect(focused.id).toBe('team-mood');
  });
});

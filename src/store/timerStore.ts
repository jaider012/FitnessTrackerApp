import { create } from 'zustand';
import { RestTimer } from '../types';

interface TimerState {
  timer: RestTimer;
  intervalId: NodeJS.Timeout | null;
  startTimer: (duration: number, exerciseId?: string, setId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timer: {
    isActive: false,
    duration: 0,
    remaining: 0,
  },
  intervalId: null,

  startTimer: (duration: number, exerciseId?: string, setId?: string) => {
    const { stopTimer } = get();
    stopTimer(); // Clear any existing timer

    set({
      timer: {
        isActive: true,
        duration,
        remaining: duration,
        exerciseId,
        setId,
      }
    });

    const intervalId = setInterval(() => {
      get().tick();
    }, 1000);

    set({ intervalId });
  },

  pauseTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }
    
    set((state) => ({
      timer: {
        ...state.timer,
        isActive: false,
      }
    }));
  },

  resumeTimer: () => {
    const { timer } = get();
    if (timer.remaining > 0) {
      set((state) => ({
        timer: {
          ...state.timer,
          isActive: true,
        }
      }));

      const intervalId = setInterval(() => {
        get().tick();
      }, 1000);

      set({ intervalId });
    }
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }

    set({
      timer: {
        isActive: false,
        duration: 0,
        remaining: 0,
      },
      intervalId: null,
    });
  },

  tick: () => {
    const { timer, stopTimer } = get();
    
    if (timer.remaining <= 1) {
      stopTimer();
      // TODO: Play notification sound or vibration
      return;
    }

    set((state) => ({
      timer: {
        ...state.timer,
        remaining: state.timer.remaining - 1,
      }
    }));
  },
})); 
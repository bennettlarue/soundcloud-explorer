declare global {
  interface SoundCloudWidget {
    play(): void;
    pause(): void;
    toggle(): void;
    seekTo(ms: number): void;
    setVolume(volume: number): void;
    getPosition(callback: (pos: number) => void): void;
    getDuration(callback: (dur: number) => void): void;
    load(url: string, options?: { auto_play?: boolean }): void;
    bind(event: string, callback: (data?: any) => void): void;
    unbind(event: string): void;
  }

  interface Window {
    SC: {
      Widget: {
        (iframe: HTMLIFrameElement): SoundCloudWidget;
        Events: {
          READY: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
          PLAY_PROGRESS: string;
          SEEK: string;
          ERROR: string;
        };
      };
    };
  }
}

export {};

import * as React from 'react';
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cx } from '../_cx';

/* ─── Imperative ref type ───────────────────────────────────────────────────── */

export interface VideoPlayerRef {
  /** Start playing the video. */
  play: () => void;
  /** Pause the video. */
  pause: () => void;
  /** Whether the video is currently paused. */
  readonly paused: boolean;
  /** The underlying HTMLVideoElement. */
  readonly videoElement: HTMLVideoElement | null;
}

/* ─── Props ─────────────────────────────────────────────────────────────────── */

export interface VideoPlayerProps {
  /** URL of the video to play. */
  src: string;
  /** MIME type of the video. @default 'video/mp4' */
  type?: string | undefined;
  /** Whether the video should auto-play on load. */
  autoPlay?: boolean | undefined;
  /** URL of a thumbnail image shown before playback starts. */
  thumbnailUrl?: string | undefined;
  /** Alt text for the thumbnail image. */
  thumbnailAlt?: string | undefined;
  /** Show a semi-transparent overlay over the thumbnail. */
  showThumbnailOverlay?: boolean | undefined;
  /**
   * Size of the video player.
   * - `'sm'` — compact; hides progress bar
   * - `'md'` — standard controls
   * - `'lg'` — full controls including volume slider and playback speed
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Additional CSS class name. */
  className?: string | undefined;
}

/* ─── Helper ────────────────────────────────────────────────────────────────── */

function formatTime(time: number): string {
  const minutes = Math.max(Math.floor(time / 60), 0);
  const seconds = Math.max(Math.floor(time % 60), 0);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/* ─── VideoPlayer ───────────────────────────────────────────────────────────── */

/**
 * Full-featured video player with custom controls.
 *
 * Keyboard shortcuts (when container is focused):
 * - `Space` / `K` — play/pause
 * - `F` — fullscreen
 * - `M` — mute/unmute
 * - `←` / `→` — seek ±10 s
 * - `↑` / `↓` — volume ±10%
 *
 * @example
 * ```tsx
 * import { VideoPlayer } from '@tale-ui/react/video-player';
 *
 * <VideoPlayer.Root
 *   src="/intro.mp4"
 *   size="md"
 *   thumbnailUrl="/thumb.jpg"
 * />
 * ```
 */
export const Root = React.forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      src,
      type = 'video/mp4',
      autoPlay = false,
      thumbnailUrl,
      thumbnailAlt,
      showThumbnailOverlay,
      size = 'md',
      className,
    },
    ref,
  ) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const progressRef = React.useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [buffered, setBuffered] = React.useState<TimeRanges | null>(null);
    const [hoverTime, setHoverTime] = React.useState<number | null>(null);
    const [hoverPosition, setHoverPosition] = React.useState<number | null>(null);
    const [showThumbnail, setShowThumbnail] = React.useState(true);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(false);
    const [previousVolume, setPreviousVolume] = React.useState(1);
    const [playbackRate, setPlaybackRate] = React.useState(1);
    const [controlsVisible, setControlsVisible] = React.useState(false);

    const playbackSpeeds = React.useMemo(() => [1, 1.25, 1.5, 1.75, 2], []);

    React.useImperativeHandle(ref, () => ({
      play() {
        videoRef.current?.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      },
      pause() {
        videoRef.current?.pause();
        setIsPlaying(false);
      },
      get paused() {
        return videoRef.current?.paused ?? true;
      },
      get videoElement() {
        return videoRef.current;
      },
    }));

    const togglePlay = React.useCallback(() => {
      if (!videoRef.current) { return; }
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }, [isPlaying]);

    const toggleMute = React.useCallback(() => {
      if (!videoRef.current) { return; }
      if (isMuted) {
        setVolume(previousVolume);
        videoRef.current.volume = previousVolume;
      } else {
        setPreviousVolume(volume);
        setVolume(0);
        videoRef.current.volume = 0;
      }
      setIsMuted((v) => !v);
    }, [isMuted, previousVolume, volume]);

    const toggleFullscreen = React.useCallback(() => {
      if (!document.fullscreenElement) {
        videoRef.current?.parentElement?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }, []);

    const toggleSpeed = React.useCallback(() => {
      if (!videoRef.current) { return; }
      const idx = playbackSpeeds.indexOf(playbackRate);
      const next = playbackSpeeds[(idx + 1) % playbackSpeeds.length]!;
      setPlaybackRate(next);
      videoRef.current.playbackRate = next;
    }, [playbackRate, playbackSpeeds]);

    const handleProgressClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (!progressRef.current || !videoRef.current) { return; }
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
      },
      [duration],
    );

    const handleProgressHover = React.useCallback(
      (event: React.MouseEvent) => {
        if (!progressRef.current || !videoRef.current) { return; }
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        setHoverTime(pos * duration);
        setHoverPosition(event.clientX - rect.left);
      },
      [duration],
    );

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(event.target.value);
      setVolume(val);
      if (videoRef.current) { videoRef.current.volume = val; }
      setIsMuted(val === 0);
    };

    // Video event listeners
    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) { return undefined; }

      const onTimeUpdate = () => setCurrentTime(video.currentTime);
      const onDurationChange = () => setDuration(video.duration);
      const onEnded = () => {
        setIsPlaying(false);
        setShowThumbnail(true);
      };
      const onProgress = () => setBuffered(video.buffered);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Space' || event.code === 'KeyK') {
          event.preventDefault();
          togglePlay();
        }
        if (event.code === 'KeyF') {
          event.preventDefault();
          toggleFullscreen();
        }
        if (event.code === 'KeyM') {
          event.preventDefault();
          toggleMute();
        }
        if (event.code === 'ArrowUp') {
          event.preventDefault();
          const v = Math.min(video.volume + 0.1, 1);
          video.volume = v;
          setVolume(v);
          setIsMuted(v === 0);
        }
        if (event.code === 'ArrowDown') {
          event.preventDefault();
          const v = Math.max(video.volume - 0.1, 0);
          video.volume = v;
          setVolume(v);
          setIsMuted(v === 0);
        }
        if (event.code === 'ArrowLeft') {
          event.preventDefault();
          video.currentTime = Math.max(video.currentTime - 10, 0);
        }
        if (event.code === 'ArrowRight') {
          event.preventDefault();
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
        }
      };

      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('durationchange', onDurationChange);
      video.addEventListener('ended', onEnded);
      video.addEventListener('progress', onProgress);
      video.addEventListener('keydown', onKeyDown);

      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('durationchange', onDurationChange);
        video.removeEventListener('ended', onEnded);
        video.removeEventListener('progress', onProgress);
        video.removeEventListener('keydown', onKeyDown);
      };
    }, [togglePlay, toggleMute, toggleFullscreen]);

    // Fullscreen change listener
    React.useEffect(() => {
      const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
      document.addEventListener('fullscreenchange', onFsChange);
      return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const renderBuffered = () => {
      if (!buffered || duration === 0) { return null; }
      const segments = [];
      for (let i = 0; i < buffered.length; i += 1) {
        const start = (buffered.start(i) / duration) * 100;
        const end = (buffered.end(i) / duration) * 100;
        segments.push(
          <div
            key={i}
            className="tale-video-player__progress-buffered"
            style={{ left: `${start}%`, width: `${end - start}%` }}
          />,
        );
      }
      return segments;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        className={cx(`tale-video-player tale-video-player--${size}`, className)}
        onMouseEnter={() => setControlsVisible(true)}
        onMouseLeave={() => {
          setControlsVisible(false);
          setHoverTime(null);
          setHoverPosition(null);
        }}
        onFocus={() => setControlsVisible(true)}
        onBlur={() => setControlsVisible(false)}
      >
        {/* Thumbnail overlay */}
        {thumbnailUrl && (
          <button
            type="button"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            onClick={togglePlay}
            className={cx(
              'tale-video-player__thumbnail',
              showThumbnail ? 'tale-video-player__thumbnail--visible' : undefined,
            )}
          >
            <img
              src={thumbnailUrl}
              alt={thumbnailAlt}
              className="tale-video-player__thumbnail-img"
            />
            <div className="tale-video-player__thumbnail-play">
              <Play className="tale-video-player__thumbnail-play-icon" aria-hidden="true" />
            </div>
            {showThumbnailOverlay && (
              <div className="tale-video-player__thumbnail-overlay" />
            )}
          </button>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          tabIndex={0}
          autoPlay={autoPlay}
          className="tale-video-player__video"
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        >
          <source src={src} type={type} />
          <track kind="captions" />
        </video>

        {/* Controls */}
        <div
          className={cx(
            'tale-video-player__controls',
            controlsVisible ? 'tale-video-player__controls--visible' : undefined,
          )}
        >
          <div className="tale-video-player__controls-inner">
            {/* Play/Pause */}
            <button
              type="button"
              tabIndex={-1}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="tale-video-player__btn"
            >
              {isPlaying ? (
                <Pause className="tale-video-player__btn-icon" aria-hidden="true" />
              ) : (
                <Play className="tale-video-player__btn-icon" aria-hidden="true" />
              )}
            </button>

            {/* Volume — sm/md: icon only; lg: icon + slider */}
            {size !== 'lg' ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="tale-video-player__btn"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="tale-video-player__btn-icon" aria-hidden="true" />
                ) : (
                  <Volume2 className="tale-video-player__btn-icon" aria-hidden="true" />
                )}
              </button>
            ) : (
              <div className="tale-video-player__volume">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="tale-video-player__btn"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="tale-video-player__btn-icon" aria-hidden="true" />
                  ) : (
                    <Volume2 className="tale-video-player__btn-icon" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  tabIndex={-1}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  className="tale-video-player__volume-slider"
                  style={{
                    backgroundImage: `linear-gradient(to right, white ${volume * 100}%, rgb(255 255 255 / 0.3) ${volume * 100}%)`,
                  }}
                />
              </div>
            )}

            {/* Progress area (hidden on sm) */}
            <div
              className={cx(
                'tale-video-player__progress-area',
                size === 'sm' ? 'tale-video-player__progress-area--hidden' : undefined,
              )}
            >
              <span className="tale-video-player__time">{formatTime(currentTime)}</span>

              <div
                ref={progressRef}
                role="slider"
                tabIndex={0}
                aria-label="Video progress"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                onClick={handleProgressClick}
                onMouseMove={handleProgressHover}
                onMouseLeave={() => {
                  setHoverTime(null);
                  setHoverPosition(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft' && videoRef.current) {
                    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
                  }
                  if (event.key === 'ArrowRight' && videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration);
                  }
                }}
                className="tale-video-player__progress"
              >
                <div className="tale-video-player__progress-bar">
                  {renderBuffered()}
                  <div
                    className="tale-video-player__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {hoverPosition !== null && (
                    <div
                      className="tale-video-player__progress-hover-line"
                      style={{ left: hoverPosition }}
                    />
                  )}
                  {hoverTime !== null && hoverPosition !== null && (
                    <div
                      className="tale-video-player__progress-hover-time"
                      style={{ left: hoverPosition }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>
              </div>

              <span className="tale-video-player__time">
                -{formatTime(duration - currentTime)}
              </span>
            </div>

            {/* Playback speed (lg only) */}
            {size === 'lg' && (
              <button
                type="button"
                tabIndex={-1}
                onClick={toggleSpeed}
                aria-label={`Playback speed: ${playbackRate}x`}
                className="tale-video-player__btn tale-video-player__speed-btn"
              >
                <span className="tale-video-player__speed-label">{playbackRate}</span>
                <svg viewBox="0 0 8 8" fill="none" className="tale-video-player__speed-x" aria-hidden="true">
                  <path
                    d="M6 2L2 6M2 2L6 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              tabIndex={-1}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="tale-video-player__btn"
            >
              {isFullscreen ? (
                <Minimize2 className="tale-video-player__btn-icon" aria-hidden="true" />
              ) : (
                <Maximize2 className="tale-video-player__btn-icon" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
Root.displayName = 'VideoPlayer.Root';

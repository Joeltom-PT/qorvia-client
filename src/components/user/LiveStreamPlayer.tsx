import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface LiveStreamPlayerProps {
    streamKey: string;
  }

const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({ streamKey }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(false);
  
  const checkServerAvailability = async (): Promise<void> => {
    try {
      const response = await fetch(`http://13.203.77.39/hls/${streamKey}.m3u8`, {
        method: 'HEAD',
      });
      if (response.ok) {
        setIsServerAvailable(true);
      } else {
        setIsServerAvailable(false);
      }
    } catch (error) {
      setIsServerAvailable(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkServerAvailability();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const playerElement = videoRef.current;

    if (isServerAvailable && playerElement) {
      const player = videojs(playerElement, {
        techOrder: ['html5'],
        sources: [
          {
            src: 'http://13.203.77.39/hls/myStreamKey.m3u8',
            type: 'application/x-mpegURL',
          },
        ],
        autoplay: true,
        controls: true,
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [isServerAvailable]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {!isServerAvailable ? (
        <img
          src="https://img.freepik.com/premium-vector/creative-business-youtube-thumbnail-template-gaming-thumbnail-gaming-video-thumbnail-youtube_589251-204.jpg"
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div data-vjs-player className="w-full h-full">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin w-full h-full"
            controls
          ></video>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;

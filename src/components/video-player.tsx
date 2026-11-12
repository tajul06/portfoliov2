"use client";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  // Extract video ID for YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract video ID for Vimeo
  const getVimeoId = (url: string) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Extract video ID for Google Drive
  const getGoogleDriveId = (url: string) => {
    const regExp = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);
  const driveId = getGoogleDriveId(url);

  if (driveId) {
    return (
      <div className="relative w-full pt-[56.25%] border-2 border-primary bg-muted rounded-xl overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://drive.google.com/file/d/${driveId}/preview`}
          title={title || "Google Drive Demo Video"}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className="relative w-full pt-[56.25%] border-2 border-primary bg-muted">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title || "Demo Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div className="relative w-full pt-[56.25%] border-2 border-primary bg-muted">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title || "Demo Video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video file (mp4, webm)
  return (
    <div className="border-2 border-primary bg-muted">
      <video
        className="w-full h-auto"
        controls
        title={title || "Demo Video"}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

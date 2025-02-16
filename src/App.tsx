import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { parseTime } from "./utils/functions";

export default function VideoFetcher() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoSource, setVideoSource] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [shareableLink, setShareableLink] = useState<string>("");
  const playerRef = useRef<ReactPlayer>(null);

  const handleFetchVideo = (): void => {
    if (ReactPlayer.canPlay(videoUrl)) {
      setVideoSource(videoUrl);
    } else {
      alert("Invalid video URL or unsupported format");
    }
  };

  const handleTrimVideo = (): void => {
    const startSeconds = parseTime(startTime);
    const endSeconds = parseTime(endTime);

    if (
      isNaN(startSeconds) ||
      isNaN(endSeconds) ||
      startSeconds >= endSeconds
    ) {
      alert("Enter valid start and end times.");
      return;
    }

    if (playerRef.current) {
      playerRef.current.seekTo(startSeconds, "seconds");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const endSeconds = parseTime(endTime);

        if (!isNaN(endSeconds) && currentTime >= endSeconds) {
          playerRef.current.getInternalPlayer().pause();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleGenerateShareLink = (): void => {
    const startSeconds = parseTime(startTime);
    const endSeconds = parseTime(endTime);

    if (!videoSource || isNaN(startSeconds) || isNaN(endSeconds)) {
      alert("Enter valid times before generating a link.");
      return;
    }

    if (
      videoSource.includes("youtube.com") ||
      videoSource.includes("youtu.be")
    ) {
      const videoIdMatch = videoSource.match(
        /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/
      );
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        setShareableLink(
          `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}`
        );
      }
    } else {
      setShareableLink(
        `${videoSource}?start=${startSeconds}&end=${endSeconds}`
      );
    }
  };

  const handleCopyToClipboard = (): void => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 full-width">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Fetch Video</h2>
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleFetchVideo}
          className="w-full p-2 bg-blue-500 text-white rounded">
          Fetch Video
        </button>
      </div>

      {videoSource && (
        <div className="mt-6 w-72 h-72">
          <ReactPlayer
            ref={playerRef}
            url={videoSource}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}

      {videoSource && (
        <div className="mt-4 flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Start time (mm:ss or seconds)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-center p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="End time (mm:ss or seconds)"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 text-center p-2 border rounded w-full"
          />
          <button
            onClick={handleTrimVideo}
            className="mt-2 w-full p-2 bg-green-500 text-white rounded">
            Trim Video
          </button>
          <button
            onClick={handleGenerateShareLink}
            className="mt-2 w-full p-2 bg-purple-500 text-white rounded">
            Generate Shareable Link
          </button>
        </div>
      )}

      {shareableLink && (
        <div className="mt-6 flex flex-col items-center">
          <input
            type="text"
            readOnly
            value={shareableLink}
            className="text-center p-2 border rounded w-full"
          />
          <button
            onClick={handleCopyToClipboard}
            className="mt-2 w-full p-2 bg-red-500 text-white rounded">
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}

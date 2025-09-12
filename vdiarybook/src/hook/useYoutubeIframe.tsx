import { useEffect, useRef } from "react";

interface YoutubeIframeProps {
  embedUrl: string;
  index: number;
}

const YoutubeIframe: React.FC<YoutubeIframeProps> = ({ embedUrl, index }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

 useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const player = iframe.contentWindow;
        if (!player) return;

        if (entry.isIntersecting) {
          player.postMessage(
            JSON.stringify({ event: "command", func: "playVideo" }),
            "*"
          );
        } else {
          player.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo" }),
            "*"
          );
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(iframe);
  return () => observer.disconnect();
}, []);

  const urlWithAPI = embedUrl.includes("?")
    ? `${embedUrl}&enablejsapi=1&mute=1`
    : `${embedUrl}?enablejsapi=1&mute=1`;

  return (
    <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
      <iframe
        ref={iframeRef}
        src={urlWithAPI}
        title={`YouTube video player ${index}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default YoutubeIframe;

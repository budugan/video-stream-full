import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import './index.css';

const Preview = ({ videoSource }) => {
  const { tag } = useParams();
  const container = useRef(null);
  const resizeObserverTimeout = useRef(null);
  const maxNrOfResizes = 500;
  const [playerSize, setPlayerSize] = useState({ width: "100%", height: "100%" });
  const [videoExists, setVideoExists] = useState(false);
  const videoUrl = `http://localhost:5000/video/${tag}.mp4`;

  useEffect(() => {
    if (tag) {
      fetch(videoUrl, { method: "GET", headers: { Range: "bytes=0-1" } })
        .then((res) => {
          if (res.status === 206 || res.status === 200) {
            setVideoExists(true);
          } else {
            setVideoExists(false);
          }
        })
        .catch(() => setVideoExists(false));
    }
  }, [tag]);

  useEffect(() => {
    adjustFontSize();

    const ro = new ResizeObserver(() => {
      clearTimeout(resizeObserverTimeout.current);
      resizeObserverTimeout.current = setTimeout(() => {
        adjustFontSize();
      }, 1000);
    });

    if (container.current) {
      ro.observe(container.current);
    }

    return () => {
      if (container.current) {
        ro.unobserve(container.current);
      }
    };
  }, []);

  const adjustFontSize = () => {
    if (container.current) {
      let internalFontSize = parseFloat(
        getComputedStyle(container.current).fontSize
      );
      container.current.style.fontSize = internalFontSize + "px";

      requestAnimationFrame(() => {
        let iterations = 0;
        while (
          container.current.clientWidth >= container.current.scrollWidth &&
          container.current.clientHeight >= container.current.scrollHeight
        ) {
          internalFontSize++;
          container.current.style.fontSize = internalFontSize + "px";
          iterations++;
          if (iterations > maxNrOfResizes) {
            setTimeout(() => adjustFontSize(), 1000);
            return;
          }
        }
        while (
          container.current.clientWidth < container.current.scrollWidth ||
          container.current.clientHeight < container.current.scrollHeight
        ) {
          internalFontSize--;
          container.current.style.fontSize = internalFontSize + "px";
          iterations++;
          if (iterations > maxNrOfResizes) {
            setTimeout(() => adjustFontSize(), 1000);
            return;
          }
        }
      });
    }
  };

  return (
    <div
      ref={container}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {tag && videoExists ? (
        <ReactPlayer
          url={videoUrl}
          controls
          width={playerSize.width}
          height={playerSize.height}
        />
      ) : (
        <p >Niciun videoclip cu tag {tag}</p>
      )}
    </div>
  );
};

export default Preview;

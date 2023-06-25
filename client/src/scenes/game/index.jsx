import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";

import { Header, OverviewChart } from "components";

import React, { useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from "./app.module.css";

const Game = () => {
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    sendMessage,
    addEventListener,
    removeEventListener,
    requestFullscreen,
    takeScreenshot,
    unload,
  } = useUnityContext({
    loaderUrl: "build/app.loader.js",
    dataUrl: "build/app.data",
    frameworkUrl: "build/app.framework.js",
    codeUrl: "build/app.wasm",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [screenshotDatas, setScreenshotDatas] = useState([]);
  const [scores, setScores] = useState([]);

  const handleClickStartGame = (time) => {
    if (isLoaded === false || isPlaying === true) {
      return;
    }
    setIsPlaying(true);
    sendMessage("GameController", "StartGame", time);
  };

  const handleClickFullscreen = () => {
    if (isLoaded === false) {
      return;
    }
    requestFullscreen(true);
  };

  const handleClickScreenshot = () => {
    if (isLoaded === false) {
      return;
    }
    const screenshotData = takeScreenshot();
    if (screenshotData !== undefined) {
      setScreenshotDatas([screenshotData, ...screenshotDatas]);
    }
  };

  const handleClickUnload = async () => {
    if (isLoaded === false) {
      return;
    }
    try {
      await unload();
      console.log("Unload success");
    } catch (error) {
      console.error(`Unable to unload: ${error}`);
    }
  };

  const handleGameOver = useCallback(
    (time, score) => {
      time = Math.round(time);
      setIsPlaying(false);
      setScores([[time, score], ...scores]);
    },
    [scores]
  );

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [handleGameOver, addEventListener, removeEventListener]);

  return (
    <Box m="1.5rem 2.5rem">
      {/* Header */}
      <Header title="Just press Play!" subtitle="This is a Beta Version." />
      <Box height="75vh">
        <div className={styles.container}>
          <div className={styles.unityWrapper}>
            {isLoaded === false && (
              <div className={styles.loadingBar}>
                <div
                  className={styles.loadingBarFill}
                  style={{ width: loadingProgression * 100 }}
                />
              </div>
            )}
            <Unity
              unityProvider={unityProvider}
              style={{ display: isLoaded ? "block" : "none" }}
            />
          </div>
          <div className="buttons">
            <button onClick={() => handleClickStartGame(5)}>
              Start Short Game
            </button>
            <button onClick={handleClickFullscreen}>Fullscreen</button>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Game;

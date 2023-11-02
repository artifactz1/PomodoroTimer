import React, { useRef, useEffect, useState } from "react";

function AudioPlayer() {
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeA1, setCurrentTimeA1] = useState(0);
  const [currentTimeA2, setCurrentTimeA2] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(audioRef1.current);
  const [isAudio1, checkAudio1] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef1.current && audioRef2.current) {
      audioRef1.current.loop == false;
      audioRef2.current.loop == false;
      const totalTime = audioRef1.current.duration;

      if (isAudio1 === true) {
        setCurrentAudio(audioRef1.current);
        audioRef1.current.addEventListener("timeupdate", () => {
          setCurrentTime(audioRef1.current?.currentTime ?? 0);
          audioRef2.current?.pause;
        });
      } else {
        setCurrentAudio(audioRef2.current);
        audioRef2.current.addEventListener("timeupdate", () => {
          setCurrentTime(audioRef2.current?.currentTime ?? 0);
          audioRef1.current?.pause;
        });
      }

      audioRef1.current.addEventListener("timeupdate", () => {
        if (audioRef1.current?.currentTime === totalTime) {
          audioRef1.current.pause();
          audioRef1.current.volume = 0;
        }

        setCurrentTimeA1(audioRef1.current?.currentTime ?? 0);
      });

      audioRef2.current.addEventListener("timeupdate", () => {
        if (audioRef2.current?.currentTime === totalTime) {
          audioRef2.current.pause();
          audioRef2.current.volume = 0;
        }

        setCurrentTimeA2(audioRef2.current?.currentTime ?? 0);
      });

      if (currentTime >= totalTime - 10) {
        handleAudioEnd();
      }
    }

    console.log("currentAudio:", currentAudio);
    // console.log("A1:", audioRef1);
    // console.log("A2:", audioRef2);
  }, [currentTime, audioRef1, audioRef2, currentAudio]);

  const play_pause_transition = () => {
    if (currentAudio) {
      let currentVolume = currentAudio.volume;
      const interval = setInterval(() => {
        currentVolume -= fadeOutInterval / (crossfadeDuration * 1000);
        currentAudio.volume = Math.max(currentVolume, 0);

        if (currentVolume <= 0) {
          clearInterval(interval);
          currentAudio.pause();
          setIsPlaying(false);
          currentAudio.volume = 1;
        }
      }, fadeOutInterval);
    }
  };

  const crossfadeDuration = 2;
  const fadeOutInterval = 10;

  const handleAudioEnd = () => {
    const fromAudio =
      currentAudio === audioRef1.current
        ? audioRef1.current!
        : audioRef2.current!;
    const toAudio =
      currentAudio === audioRef1.current
        ? audioRef2.current!
        : audioRef1.current!;

    if (fromAudio.currentTime === fromAudio.duration) {
      fromAudio.currentTime = 0;
      fromAudio.volume = 0;
      fromAudio.pause();
    }
    // toAudio.currentTime = 0; // Ensure that the "to" audio starts from the beginning
    setCurrentTime(toAudio.currentTime);
    toAudio.volume = 1; // Play only the "to" audio
    toAudio.play(); // Play only the "to" audio
    setCurrentAudio(toAudio);

    checkAudio1(isAudio1 === true ? false : true);
  };

  const toggleAudio = () => {
    if (currentAudio) {
      if (isPlaying) {
        setIsPlaying(false);
        play_pause_transition();
      } else {
        currentAudio.currentTime = 0;
        currentAudio.play();
        setIsPlaying(true);
        setCurrentTime(currentAudio.currentTime);
      }
    }
  };

  return (
    <div>
      <button onClick={toggleAudio}>{isPlaying ? "Pause" : "Play"}</button>
      <p>Current Time: {currentTime.toFixed(2)} seconds</p>
      <p>Current Time A1: {currentTimeA1.toFixed(2)} seconds</p>
      <p>Current Time A2: {currentTimeA2.toFixed(2)} seconds</p>
      <div>
        <audio ref={audioRef1} controls>
          <source
            src="https://cdn.pixabay.com/audio/2022/07/04/audio_f52a5754b1.mp3"
            type="audio/mpeg"
          />
          Your browser does not support the audio element. 1
        </audio>
      </div>
      <div>
        <audio ref={audioRef2} controls>
          <source
            src="https://cdn.pixabay.com/audio/2022/07/04/audio_f52a5754b1.mp3"
            type="audio/mpeg"
          />
          Your browser does not support the audio element. 2
        </audio>
      </div>
    </div>
  );
}

export default AudioPlayer;

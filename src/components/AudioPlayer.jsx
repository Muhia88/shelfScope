import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
// Imports icons for the play/pause button.
import { FaPlay, FaPause } from 'react-icons/fa';

// Helper function to format seconds into a MM:SS string.
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) {
    return '0:00';
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  // Pad the seconds with a leading zero if needed.
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


//provides the user interface for playing audiobooks
const AudioPlayer = forwardRef(({ audioUrl, startTime, onSave }, ref) => {
  // State to track whether the audio is currently playing.
  const [isPlaying, setIsPlaying] = useState(false);
  // State to track the playback progress as a percentage (0-100).
  const [progress, setProgress] = useState(0);
  // State to track the current playback time in seconds.
  const [currentTime, setCurrentTime] = useState(startTime || 0);
  
  const audioRef = useRef(null);

  // An effect that runs when the audio source (audioUrl) or the initial start time changes.
  useEffect(() => {
    // If the audio element exists pause the player, 
    // reset the progress bar, and set the current time to the new start time
    if (audioRef.current) {
      setIsPlaying(false);
      setProgress(0);
      audioRef.current.currentTime = startTime || 0;
    }
  }, [audioUrl, startTime]);

  // Function to toggle between play and pause.
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    // Toggles the isPlaying state.
    setIsPlaying(!isPlaying);
  };

  // Function that is called continuously as the audio plays to update the progress.
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      // Calculates and sets the progress percentage.
      setProgress((audio.currentTime / audio.duration) * 100);
      // Updates the current time state.
      setCurrentTime(audio.currentTime);
    }
  };

  // Function to handle the user manually seeking through the audio with the range input.
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    if (audioRef.current.duration) {
      // Calculates the new time based on the slider's position and sets it on the audio element.
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      // Updates the progress state.
      setProgress(newProgress);
    }
  };

  // Exposes the `saveCurrentTime` function to the parent component via the ref.
  useImperativeHandle(ref, () => ({
    saveCurrentTime() {
      // Calls the onSave function passed down from the parent with the current time.
      onSave(audioRef.current.currentTime);
    }
  }));

  
  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4">
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => {
          // When new audio is loaded, set its start time
          if (audioRef.current) {
            audioRef.current.currentTime = startTime || 0;
            setProgress((startTime / audioRef.current.duration) * 100 || 0)
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      
      <div className="flex items-center space-x-4">
        
        <button
          onClick={togglePlay}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 transition-transform transform hover:scale-110"
        >
          
          {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
        </button>

        
        <span className="text-sm text-gray-600 w-12 text-center">
          {formatTime(currentTime)}
        </span>

        
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          // A style to make the track of the range input show the progress.
          style={{
            background: `linear-gradient(to right, #8B5CF6 ${progress}%, #d1d5db ${progress}%)`
          }}
        />
       
        <span className="text-sm text-gray-600 w-12 text-center">
          {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
        </span>
      </div>
    </div>
  );
});


export default AudioPlayer;
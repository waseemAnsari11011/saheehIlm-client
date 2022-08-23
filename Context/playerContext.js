import React, { useState } from "react";

const PlayerContext = React.createContext();

const PlayerProvider = ({ children }) => {
  const [myBookIds, setmyBookIds] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlayerContext.Provider
      value={{
        audiobooks,
        setAudiobooks,
        myBookIds,
        setmyBookIds,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext, PlayerProvider };

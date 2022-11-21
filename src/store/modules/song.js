function format(duration) {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`;
  }

  ret += `${mins}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
}

export default {
  state: {
    songAudio: null,
    songProgress: 0,
    durationInMinutes: 0,

    selectedSong: '',
    isPlaying: false,
  },

  mutations: {
    selectSong: (state, songUrl) => {
      if (state.isPlaying) {
        state.songAudio.pause();
        state.songAudio.currentTime = 0;
      }

      state.selectedSong = songUrl;
      state.songAudio = new Audio(songUrl);

      state.songAudio?.addEventListener('loadeddata', () => {
        const { duration, currentTime } = state.songAudio;

        state.songProgress = currentTime;
        state.durationInMinutes = format(duration);
      });

      state.songAudio?.addEventListener('playing', () => {
        setInterval(() => {
          state.durationInMinutes = format(state.songAudio.duration - state.songAudio.currentTime);

          state.songProgress = (state.songAudio.currentTime / state.songAudio.duration) * 100;
        }, 1000);
      });
    },

    playSong: (state) => {
      state.isPlaying = true;
      state.songAudio.play();
    },

    pauseSong: (state) => {
      state.isPlaying = false;

      state.songAudio?.pause();
    },

  },

  actions: {

  },
};

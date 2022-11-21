<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <label class="text-gray-500 text-sm">
        <input type="radio" :checked="isSelectedSong" @change.prevent="handleSongChange(song.url)"/>
      </label>
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600"
        >{{ song.modifiedName }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600"></i>
        {{ song.commentCount }}
      </span>
    </div>
  </li>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'song-item',
  props: ['song'],

  computed: {
    ...mapState({ selectedSong: (state) => state.song.selectedSong, isPlaying: (state) => state.song.isPlaying }),

    isSelectedSong() {
      return this.selectedSong === this.song.url;
    },
  },

  methods: {
    ...mapMutations(['selectSong', 'playSong']),

    handleSongChange(song) {
      this.selectSong(song);
      if (this.isPlaying) this.playSong();
    },
  },
};
</script>

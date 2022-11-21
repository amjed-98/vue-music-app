<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <file-upload @addSong="addSong" ref="upload" />

      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>

          <!-- songs list -->
          <div class="p-6">
            <songs-list
              v-for="(song, i) in mySongs"
              :song="song"
              :key="song.docID"
              @editSong="editSongState"
              @deleteSong="deleteSongState"
              :setUnsavedChanges='setUnsavedChanges'
              :index="i"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { songsCollection, auth } from '@/includes/firebase';
import FileUpload from '../components/FileUpload.vue';
import SongsList from '../components/SongsList.vue';
// import store from '../store';

export default {
  name: 'manage-page',
  data() {
    return {
      mySongs: [],
      hasUnsavedChanges: false,
    };
  },
  components: { FileUpload, SongsList },

  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    snapshot.forEach(this.addSong);
  },

  methods: {
    editSongState({ modifiedName, genre, index }) {
      this.mySongs[index].modifiedName = modifiedName;
      this.mySongs[index].genre = genre;
    },

    deleteSongState(i) {
      this.mySongs.splice(i, 1);
    },

    addSong(document) {
      const song = { ...document.data(), docID: document.id };
      this.mySongs.push(song);
    },

    setUnsavedChanges(value) {
      this.hasUnsavedChanges = value;
    },
  },

  beforeRouteLeave(_to, _from, next) {
    if (!this.hasUnsavedChanges) {
      next();
      return;
    }

    // eslint-disable-next-line no-alert
    const hasConfirmedLeaving = window.confirm(
      'are you sure you want to leave, you still have unsaved changes!',
    );
    next(hasConfirmedLeaving);
  },

  // beforeRouteEnter(_to, _from, next) {
  //   if (store.state.auth.isLoggedIn) next();
  //   else next({ name: 'home' });
  // },
};
</script>

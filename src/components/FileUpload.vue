<template>
  <div class="col-span-1">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <!-- Upload Dropbox -->
        <div
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true"
          @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload"
        >
          <h5>Drop your files here</h5>
        </div>

        <label>
          <input type="file" multiple @change="upload" />
        </label>

        <hr class="my-6" />
        <!-- Progress Bars -->
        <div class="mb-4" v-for="upload in uploads" :key="upload">
          <!-- File Name -->
          <div class="font-bold text-sm" :class="upload.text_class">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
              class="transition-all progress-bar bg-blue-400"
              :class="upload.variant"
              :style="{ width: `${upload.current_progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '../includes/firebase';

export default {
  name: 'file-upload',

  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },

  methods: {
    upload(event) {
      this.is_dragover = false;
      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return;

        const storageRef = storage.ref(); // 'music-7e35b.firebaseapp.com', // ? storage bucket
        const songsRef = storageRef.child(`songs/${file.name}`); // 'music-7e35b.firebaseapp.com/songs/example.mp3'
        const task = songsRef.put(file);
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        task.on(
          'state_changed',
          (snapshot) => this.handleUpload(snapshot, uploadIndex),
          (error) => this.handleFailedUpload(error, uploadIndex),
          () => this.handleSuccessUpload(task, uploadIndex),
        );
      });
    },

    handleUpload({ totalBytes, bytesTransferred }, uploadIndex) {
      const progress = (bytesTransferred / totalBytes) * 100;
      this.uploads[uploadIndex].current_progress = progress;
    },

    handleFailedUpload(error, uploadIndex) {
      this.uploads[uploadIndex].variant = 'bg-red-400';
      this.uploads[uploadIndex].icon = 'fas fa-times';
      this.uploads[uploadIndex].text_class = 'text-red-400';
      console.log(error);
    },

    async handleSuccessUpload(task, uploadIndex) {
      const song = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        originalName: task.snapshot.ref.name,
        modifiedName: task.snapshot.ref.name,
        genre: '',
        commentCount: 0,
        url: '',
      };
      song.url = await task.snapshot.ref.getDownloadURL();

      const songRef = await songsCollection.add(song);
      const songSnapShot = await songRef.get();
      this.$emit('addSong', songSnapShot);

      this.uploads[uploadIndex].variant = 'bg-green-400';
      this.uploads[uploadIndex].icon = 'fas fa-check';
      this.uploads[uploadIndex].text_class = 'text-green-400';
    },

    cancelUpload() {
      this.uploads.forEach((upload) => upload.task.cancel());
    },

    beforeUnmount() {
      this.cancelUpload();
    },
  },
};
</script>

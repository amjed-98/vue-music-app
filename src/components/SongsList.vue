<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div>
      <vee-form
        v-show="showForm"
        :validation-schema="schema"
        @submit="handleEdit"
        :initial-values="song"
      >
        <!-- Song Title -->
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="setUnsavedChanges"
          />
          <ErrorMessage name="modifiedName" class="text-red-400" />
        </div>

        <!-- Genre -->
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="setUnsavedChanges"
          />
          <ErrorMessage name="genre" class="text-red-400" />
        </div>
        <div
          class="text-white text-center font-bold p-2 mb-4"
          v-if="show_alert"
          :class="alert_variant"
        >
          {{ alert_message }}
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '../includes/firebase';

export default {
  name: 'songs-list',

  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: 'required|max:30',
        genre: 'alpha_spaces|max:15',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'please wait! updating song info',
    };
  },

  emits: ['editSong', 'deleteSong'],

  props: {
    song: { type: Object, required: true },
    index: { type: Number, required: true },
    setUnsavedChanges: Function,
  },

  methods: {
    async handleEdit({ modifiedName, genre, docID }) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! updating song info';

      try {
        await songsCollection.doc(docID).update({ modifiedName, genre });
        this.$emit('editSong', { modifiedName, genre, index: this.index });
        this.setUnsavedChanges(false);
        this.alert_variant = 'bg-green-500';
        this.in_submission = false;
        this.alert_message = 'Success!';
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'something went wrong! try again later';
      }
    },

    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.originalName}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.$emit('deleteSong', this.index);
    },

  },
};
</script>

<style></style>

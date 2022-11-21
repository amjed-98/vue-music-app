<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-2 mb-4"
          v-if="comment_show_alert"
          :class="comment_alert_variant"
        >
          {{ comment_alert_message }}
        </div>

        <vee-form @submit="addComment" :validation-schema="schema" v-if="isLoggedIn">
          <vee-field
            name="comment"
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <ErrorMessage name="comment" class="text-red-600 block mb-4" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="comment_in_submission"
          >
            Submit
          </button>
        </vee-form>

        <!-- Sort Comments -->
        <label>
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
        </label>
      </div>
    </div>
  </section>
  <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
    <!-- Comment Count -->
    <span class="card-title">Comments ({{ song.commentCount }})</span>
    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
  </div>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docID"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ new Date(comment.date).toLocaleString()}}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { auth, commentsCollection, songsCollection } from '@/includes/firebase';
import { mapState } from 'vuex';

export default {
  name: 'song-page',
  data() {
    return {
      song: {},
      comments: [],
      schema: { comment: 'required|min:3' },
      sort: 'desc',
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted',
    };
  },

  computed: {
    ...mapState({ isLoggedIn: (state) => state.auth.isLoggedIn }),
    sortedComments() {
      // using slice to create a new array
      return this.comments.slice().sort((a, b) => {
        if (this.sort === 'desc') {
          return new Date(b.date) - new Date(a.date);
        }
        return new Date(a.date) - new Date(b.date);
      });
    },
  },

  async created() {
    this.getComments();
    const docSnapShot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapShot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    this.song = docSnapShot.data();
  },

  methods: {
    async getComments() {
      const docSnapShot = await commentsCollection.where('songId', '==', this.$route.params.id).get();
      docSnapShot.forEach((document) => this.comments.push({ docID: document.id, ...document.data() }));
    },

    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! Your comment is being submitted';

      const comment = {
        content: values.comment,
        date: Date.now(),
        songId: this.$route.params.id,
        name: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
      };

      const { id } = await commentsCollection.add(comment);

      this.comments.push({ docID: id, ...comment });

      this.comment_in_submission = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Comment Submitted!';

      resetForm();
    },
  },

};
</script>

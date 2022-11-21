import { auth, usersCollection } from '@/includes/firebase';

export default {
  state: {
    authModalShow: false,
    isLoggedIn: false,
  },

  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },

    toggleAuth: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
  },

  actions: {
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) commit('toggleAuth');
    },

    async register({ commit }, payload) {
      const {
        email, password, name, age, country,
      } = payload;

      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      await usersCollection.doc(user.uid).set({
        email,
        name,
        age,
        country,
      });
      await user.updateProfile({ displayName: name });

      commit('toggleAuth');
    },

    async login({ commit }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      commit('toggleAuth');
    },

    async signout({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
    },
  },
};

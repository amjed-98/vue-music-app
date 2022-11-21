import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import './assets/tailwind.css';
import './assets/main.css';
import { auth } from './includes/firebase';
import Icon from './directives/icon';
import GlobalComponents from './includes/_globals';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router);

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.directive('icon', Icon);
    app.use(GlobalComponents);

    app.mount('#app');
  }
});

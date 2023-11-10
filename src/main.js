import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
// import "amfe-flexible";
const store = createPinia();
export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  return {
    app,
    store,
  };
}

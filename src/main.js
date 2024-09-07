import { createApp } from "vue";
import "@/assets/scss/main.scss";

import App from "./App.vue";
import usePlugin from "./plugins";

const app = createApp(App);

usePlugin(app);

app.mount("#app");

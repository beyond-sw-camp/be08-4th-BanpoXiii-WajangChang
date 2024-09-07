import router from "@/router";
import { createPinia } from "pinia";

export default function usePlugin(app) {
  app.use(createPinia());
  app.use(router);
}

// main.ts
import { createApp } from "vue";
import App from "./App.vue";

// Bootstrap 5 (BootstrapVue nie wspiera Vue 3)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faStopCircle,
  faCircleNotch,
  faChevronUp,
  faChevronDown,
  faAdjust,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faPlayCircle,
  faPauseCircle,
  faStopCircle,
  faCircleNotch,
  faChevronUp,
  faChevronDown,
  faAdjust,
  faArrowsAlt
);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

// Jeśli używasz BootstrapVue, potrzebna będzie alternatywa np. BootstrapVue 3 (community fork):
// import BootstrapVue3 from 'bootstrap-vue-3';
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
// app.use(BootstrapVue3);

app.mount("#app");

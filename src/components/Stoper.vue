<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import Cookies from "js-cookie";

type Lap = { number: number; time: string; totalTime: string };

export default defineComponent({
  name: "AppStoper",
  setup() {
    const stoperRun = ref(false);
    const startTime = ref<number | null>(null);
    const stopTime = ref<number | null>(null);
    const timer = ref<number | null>(null);
    const totalTime = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    const miliseconds = ref(0);
    const laps = ref<Lap[]>([]);
    const lapTime = ref(0);
    const sizeFontStoper = ref(5);
    const contrastDark = ref(false);

    const startStoperBtn = ref<HTMLButtonElement | null>(null);
    const stopStoperBtn = ref<HTMLButtonElement | null>(null);

    const padTo2Digits = (num: number) => num.toString().padStart(2, "0");
    const timeFormat = (time: number) => {
      let sec = Math.floor(time / 1000);
      let min = Math.floor(sec / 60);
      let hr = Math.floor(min / 60);
      sec %= 60;
      min %= 60;
      hr %= 24;
      return `${padTo2Digits(hr)}:${padTo2Digits(min)}:${padTo2Digits(sec)}`;
    };

    function startStoper() {
      stoperRun.value = true;
      if (!startTime.value) startTime.value = Date.now();
      if (startTime.value && stopTime.value) {
        startTime.value = Date.now() - (stopTime.value - startTime.value);
      }
      timer.value = window.setInterval(() => {
        totalTime.value = Date.now() - (startTime.value || 0);
      }, 1);
      nextTick(() => stopStoperBtn.value?.focus());
    }

    function stopStoper() {
      if (timer.value) clearInterval(timer.value);
      timer.value = null;
      stopTime.value = Date.now();
      nextTick(() => startStoperBtn.value?.focus());
    }

    function resetStoper() {
      if (timer.value) clearInterval(timer.value);
      timer.value = null;
      stoperRun.value = false;
      startTime.value = null;
      stopTime.value = null;
      totalTime.value = 0;
      laps.value = [];
      document.title = "Stoper online";
    }

    function addLap() {
      lapTime.value = lapTime.value > totalTime.value ? 0 : lapTime.value;
      laps.value.unshift({
        number: laps.value.length + 1,
        time: timeFormat(totalTime.value - lapTime.value),
        totalTime: timeFormat(totalTime.value),
      });
      lapTime.value = totalTime.value;
    }

    function increaseFont() {
      if (sizeFontStoper.value < 20) sizeFontStoper.value++;
    }

    function decreaseFont() {
      if (sizeFontStoper.value > 1) sizeFontStoper.value--;
    }

    function changeContrast() {
      contrastDark.value = !contrastDark.value;
    }

    function fullscreen() {
      const elem = document.documentElement;
      if (document.fullscreenElement) document.exitFullscreen?.();
      else elem.requestFullscreen?.();
    }

    function leaving() {
      if (stoperRun.value) {
        Cookies.set("timer_enabled", String(!!timer.value), { expires: 30 });
        Cookies.set("timer_stop_time", String(stopTime.value), { expires: 30 });
        Cookies.set("timer_start_time", String(startTime.value), { expires: 30 });
      } else {
        Cookies.remove("timer_enabled");
        Cookies.remove("timer_stop_time");
        Cookies.remove("timer_start_time");
      }
      if (laps.value.length) Cookies.set("timer_laps", JSON.stringify(laps.value), { expires: 30 });
      else Cookies.remove("timer_laps");
      if (lapTime.value) Cookies.set("timer_lap_time", String(lapTime.value), { expires: 30 });
      else Cookies.remove("timer_lap_time");
      Cookies.set("timer_size_font_stoper", String(sizeFontStoper.value), { expires: 30 });
      if (contrastDark.value) Cookies.set("timer_constrast_dark", "true", { expires: 30 });
      else Cookies.remove("timer_constrast_dark");
    }

    onMounted(() => {
      window.addEventListener("beforeunload", leaving);
      const start = Cookies.get("timer_start_time");
      if (start && +start > 0) {
        stoperRun.value = true;
        startTime.value = +start;
        if (Cookies.get("timer_enabled") === "true") startStoper();
        else {
          const stop = Cookies.get("timer_stop_time");
          stopTime.value = stop ? +stop : Date.now();
          totalTime.value = (stopTime.value || 0) - (startTime.value || 0);
        }
        const lapsCookie = Cookies.get("timer_laps");
        if (lapsCookie) {
          try {
            laps.value = JSON.parse(lapsCookie);
          } catch {
            laps.value = [];
          }
        }
        const lapStr = Cookies.get("timer_lap_time");
        if (lapStr && +lapStr > 0) lapTime.value = +lapStr;
      }
      const fontSize = Cookies.get("timer_size_font_stoper");
      if (fontSize && +fontSize > 0 && +fontSize < 20) sizeFontStoper.value = +fontSize;
      if (Cookies.get("timer_constrast_dark") === "true") changeContrast();
    });

    onBeforeUnmount(() => window.removeEventListener("beforeunload", leaving));

    watch(totalTime, () => {
      miliseconds.value = Math.floor((totalTime.value / 10) % 100);
      hours.value = Math.floor(totalTime.value / 3600000);
      minutes.value = Math.floor((totalTime.value / 60000) % 60);
      seconds.value = Math.floor((totalTime.value / 1000) % 60);
    });

    watch(seconds, () => {
      document.title = `${t_hours.value}${t_minutes.value}:${t_seconds.value} - Stoper online`;
    });

    const t_miliseconds = computed(() => padTo2Digits(miliseconds.value));
    const t_seconds = computed(() => padTo2Digits(seconds.value));
    const t_minutes = computed(() => padTo2Digits(minutes.value));
    const t_hours = computed(() => (hours.value === 0 ? "" : `${hours.value}:`));

    return {
      // state
      stoperRun,
      totalTime,
      startTime,
      stopTime,

      timer,
      laps,
      sizeFontStoper,
      contrastDark,
      t_miliseconds,
      t_seconds,
      t_minutes,
      t_hours,
      // refs
      startStoperBtn,
      stopStoperBtn,
      // methods
      startStoper,
      stopStoper,
      resetStoper,
      addLap,
      increaseFont,
      decreaseFont,
      changeContrast,
      fullscreen,
    };
  },
});
</script>

<template>
  <div id="stoper_outside" :class="{ 'dark-mode': contrastDark }">
    <div class="container" id="stoper_box">
      <div class="text-center">
        <h1>Stoper online</h1>
        <div id="stoper--buttons-settings">
          <button class="btn btn-link" @click="increaseFont">
            <font-awesome-icon icon="chevron-up" />
          </button>
          <button class="btn btn-link" @click="decreaseFont">
            <font-awesome-icon icon="chevron-down" />
          </button>
          <button class="btn btn-link" @click="changeContrast">
            <font-awesome-icon icon="adjust" />
          </button>
          <button class="btn btn-link" @click="fullscreen">
            <font-awesome-icon icon="arrows-alt" />
          </button>
        </div>
        <div id="stoper_digits" :style="{ fontSize: sizeFontStoper + 'em' }">
          {{ t_hours }}{{ t_minutes }}:{{ t_seconds }}<small>.{{ t_miliseconds }}</small>
        </div>
        <div id="stoper--buttons">
          <button ref="startStoperBtn" class="btn btn-primary" v-if="!timer" @click="startStoper">
            <font-awesome-icon icon="play-circle" />
          </button>
          <button ref="stopStoperBtn" class="btn btn-secondary" v-if="timer" @click="stopStoper">
            <font-awesome-icon icon="pause-circle" />
          </button>
          <button class="btn btn-warning" v-if="timer" @click="addLap">
            <font-awesome-icon icon="circle-notch" />
          </button>
          <button class="btn btn-danger" v-if="stoperRun" @click="resetStoper">
            <font-awesome-icon icon="stop-circle" />
          </button>
        </div>
        <div id="stoper--laps" v-if="laps.length">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Runda</th>
                <th scope="col">Czas</th>
                <th scope="col">Łączny czas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lap in laps" :key="lap.number">
                <td>#{{ lap.number }}</td>
                <td>{{ lap.time }}</td>
                <td>{{ lap.totalTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="stoper--description">
        <h4>Instrukcja używania stopera internetowego</h4>
        <p>
          Po kliknięciu niebieskiego przycisku z ikonką Start stoper rozpoczyna liczenie czasu z
          dokładnością do milisekundy (1/100 sekundy). Kliknięcie szarego przycisku z ikonką Pauza
          zatrzymuje liczenie czasu. Ponowne kliknięcie niebieskiego przycisku Start kontynuuje
          odliczanie. Kliknięcie żółtego przycisku z ikonką Międzyczas spowoduje dodanie
          międzyczasu. Pod stoperem wyświetla się lista międzyczasów: tabelka z informacją o różnicy
          czasu w międzyczasach oraz o całkowitym czasie. Kliknięcie czerwonego przycisku z ikonką
          Stop spowoduje zatrzymanie i wyzerowanie licznika czasu oraz skasowanie międzyczasów.
        </p>
        <p>
          Obecny czas i międzyczasy są zapisywane w ciasteczkach, dzięki czemu po ponownym wejściu
          na stronę liczenie będzie kontynuowane.
        </p>
        <p>
          Kliknięcie w strzałkę w górę zwiększa wielkość czcionki stopera a w dół - zmniejsza.
          Kliknięcie w przycisk z ikonką zmiany kontrastu zmienia kolorystykę strony. Kliknięcie w
          przycisk z ikonką pełnego ekranu spowoduje wyświetlenie strony w pełnym ekranie. Zmiany te
          zostają zapisane i zachowane przy kolejnym otwarciu okna ze stoperem
        </p>
        <p>
          Projekt dostępny do pobrania na
          <a href="https://github.com/kamilwyremski/stoper" title="Stoper na VUE" target="_blank"
            >https://github.com/kamilwyremski/stoper</a
          >
        </p>
      </div>
      <footer class="text-center">
        <p class="small">
          <a
            href="https://blog.wyremski.pl/polityka-prywatnosci/"
            target="_blank"
            title="Polityka prywatności serwisu"
            >Polityka prywatności</a
          >
          | Project 2019 - 2025 by
          <a href="http://wyremski.pl" target="_blank" title="Tworzenie Stron Internetowych"
            >Kamil Wyremski</a
          >
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
#stoper_box {
  margin: auto;
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}
#stoper_digits {
  font-size: 5em;
  font-weight: bold;
}
#stoper_digits small {
  font-size: 0.3em;
}
#stoper--buttons .btn {
  margin: 5px;
  font-size: 1.5em;
}
#stoper--laps {
  margin: 20px;
}
#stoper--description {
  margin-top: 40px;
}
#stoper_box footer {
  margin: 30px 20px 0;
}
#stoper_outside {
  background-color: #dfdfdf !important;
  padding: 40px 0;
}
#stoper_outside.dark-mode {
  background-color: black !important;
  color: #e9e9e9;
}
#stoper_outside.dark-mode #stoper_box {
  background-color: black !important;
}
#stoper_outside.dark-mode .table > :not(caption) > * > * {
  color: #e9e9e9;
  background-color: transparent;
}
@media (max-width: 576px) {
  #stoper_outside {
    padding: 0;
  }
}
</style>

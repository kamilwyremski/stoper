<template>
  <div id="stoper_outside" v-bind:class="{ 'dark-mode': contrastDark }">
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
        <div
          id="stoper_digits"
          v-bind:style="{ fontSize: sizeFontStoper + 'em' }"
        >
          {{ t_hours }}{{ t_minutes }}:{{ t_seconds
          }}<small>.{{ t_miliseconds }}</small>
        </div>
        <div id="stoper--buttons">
          <button
            ref="startStoper"
            class="btn btn-primary"
            v-if="!timer"
            @click="startStoper"
            autofocus
          >
            <font-awesome-icon icon="play-circle" />
          </button>
          <button
            ref="stopStoper"
            class="btn btn-secondary"
            v-if="timer"
            @click="stopStoper"
          >
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
              <tr v-for="lap in laps" v-bind:key="lap.number">
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
          Po kliknięciu niebieskiego przycisku z ikonką Start stoper rozpoczyna
          liczenie czasu z dokładnością do milisekundy (1/100 sekundy).
          Kliknięcie szarego przycisku z ikonką Pauza zatrzymuje liczenie czasu.
          Ponowne kiknięcie niebieskiego przycisku Start kontynuuje odliczanie.
          Kliknięcie żółtego przycisku z ikonką Międzyczas spowoduje dodanie
          międzyczasu. Pod stoperem wyświetla się lista międzyczasów: tabelka z
          informacją o różnicy czasu w międzyczasach oraz o całkowitym czasie.
          Kliknięcie czerwonego przycisku z ikonką Stop spowoduje zatrzymanie i
          wyzerowanie licznika czasu oraz skasowanie międzyczasów.
        </p>
        <p>
          Obecny czas i międzyczasy są zapisywane w ciasteczkach, dzięki czemu
          po ponownym wejściu na stronę liczenie będzie kontynuowane.
        </p>
        <p>
          Kliknięcie w strzałkę w górę zwiększa wielkość czcionki stopera a w
          dół - zmniejsza. Kliknięcie w przycisk z ikonką zmiany kontrastu
          zmnienia kolorystykę strony. Kliknięcie w przycisk z ikonką pełnego
          ekranu spowoduje wyświetlenie strony w pełnym ekranie. Zmiany te
          zostają zapisane i zachowane przy kolejnym otwarciu okna ze stoperem
        </p>
        <p>
          Projekt dostępny do pobrania na
          <a
            href="https://github.com/kamilwyremski/stoper"
            title="Stoper na VUE"
            target="_blank"
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
          | Project 2019 - 2023 by
          <a
            href="http://wyremski.pl"
            target="_blank"
            title="Tworzenie Stron Internetowych"
            >Kamil Wyremski</a
          >
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stoper",
  data: function () {
    return {
      stoperRun: false,
      startTime: null,
      stopTime: null,
      timer: null,
      totalTime: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
      laps: [],
      lapTime: 0,
      sizeFontStoper: 5,
      contrastDark: false,
    };
  },
  mounted: function () {
    window.addEventListener("beforeunload", this.leaving);
    if (this.$cookie.get("timer_start_time") > 0) {
      this.stoperRun = true;
      this.startTime = this.$cookie.get("timer_start_time");
      if (this.$cookie.get("timer_enabled") == "true") {
        this.startStoper();
      }else{
        this.stopTime = this.$cookie.get("timer_stop_time") || (new Date()).getTime();
        this.totalTime = this.stopTime - this.startTime;
      }      
      if (this.$cookie.get("timer_laps")) {
        try {
          this.laps = JSON.parse(this.$cookie.get("timer_laps"));
        } catch (e) {
          this.laps = [];
        }
        if (this.$cookie.get("timer_lap_time") > 0) {
          this.lapTime = this.$cookie.get("timer_lap_time");
        }
      }
    }
    if (
      this.$cookie.get("timer_size_font_stoper") > 0 &&
      this.$cookie.get("timer_size_font_stoper") < 20
    ) {
      this.sizeFontStoper = this.$cookie.get("timer_size_font_stoper");
    }
    if (this.$cookie.get("timer_constrast_dark") == "true") {
      this.changeContrast();
    }
  },
  methods: {
    startStoper: function () {
      this.stoperRun = true;
      if(!this.startTime){
        this.startTime = (new Date()).getTime();
      }
      if(this.startTime && this.stopTime){
        this.startTime = (new Date()).getTime() - (this.stopTime - this.startTime);
      }
      this.timer = setInterval(() => this.countdown(), 1);
      this.$nextTick(() => this.$refs.stopStoper.focus());
    },
    stopStoper: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.stopTime = (new Date()).getTime();
      this.$nextTick(() => this.$refs.startStoper.focus());
    },
    resetStoper: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.stoperRun = false;
      this.startTime = null;
      this.stopTime = null;
      this.totalTime = 0;
      this.laps = [];
      document.title = "Stoper online";
    },
    countdown: function () {
      this.totalTime = this.startTime ? (new Date()).getTime() - this.startTime : 0;
    },
    padTo2Digits: (num) => num.toString().padStart(2, '0'),
    timeFormat: function (time) {
      let seconds = Math.floor(time / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      hours = hours % 24;
      return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(
        seconds,
      )}`;
    },
    addLap: function () {
      this.lapTime = this.lapTime > this.totalTime ? 0 : this.lapTime
      this.laps.unshift({
        number: this.laps.length + 1,
        time: this.timeFormat(this.totalTime - this.lapTime),
        totalTime: this.timeFormat(this.totalTime),
      });
      this.lapTime = this.totalTime;
    },
    increaseFont: function () {
      if (this.sizeFontStoper < 20) {
        this.sizeFontStoper++;
      }
    },
    decreaseFont: function () {
      if (this.sizeFontStoper > 1) {
        this.sizeFontStoper--;
      }
    },
    changeContrast: function () {
      this.contrastDark = !this.contrastDark;
    },
    fullscreen: function () {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    leaving: function () {
      if (this.stoperRun) {
        this.$cookie.set("timer_enabled", !!this.timer, 30);
        this.$cookie.set("timer_stop_time", this.stopTime, 30);
        this.$cookie.set("timer_start_time", this.startTime, 30);
      } else {
        this.$cookie.delete("timer_enabled");
        this.$cookie.delete("timer_stop_time");
        this.$cookie.delete("timer_start_time");
      }
      if (this.laps) {
        this.$cookie.set("timer_laps", JSON.stringify(this.laps), 30);
      } else {
        this.$cookie.delete("timer_laps");
      }
      if (this.lapTime) {
        this.$cookie.set("timer_lap_time", this.lapTime, 30);
      } else {
        this.$cookie.delete("timer_lap_time");
      }
      this.$cookie.set("timer_size_font_stoper", this.sizeFontStoper, 30);
      if (this.contrastDark) {
        this.$cookie.set("timer_constrast_dark", true, 30);
      } else {
        this.$cookie.delete("timer_constrast_dark");
      }
    },
  },
  computed: {
    t_miliseconds: function () {
      return this.padTo2Digits(this.miliseconds);
    },
    t_seconds: function () {
      return this.padTo2Digits(this.seconds);
    },
    t_minutes: function () {
      return this.padTo2Digits(this.minutes);
    },
    t_hours: function () {
      return this.hours == 0 ? "" : this.hours + ":";
    },
  },
  watch: {
    totalTime: function () {
      this.miliseconds = Math.floor((this.totalTime / 10) % 100);
      this.hours = Math.floor((this.totalTime / 1000) / (60 * 60));
      this.minutes = Math.floor(((this.totalTime / 1000) / 60) - (this.hours * 60));
      this.seconds = Math.floor((this.totalTime / 1000) - (this.hours * 60 * 60) - (this.minutes * 60));      
    },
    seconds: function () {
      document.title =
        this.t_hours +
        this.t_minutes +
        ":" +
        this.t_seconds +
        " - Stoper online";
    },
  },
};
</script>

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
#stoper_outside.dark-mode .table > :not(caption) > * > *{
  color: #e9e9e9;
  background-color: transparent;
}
@media (max-width: 576px) {
  #stoper_outside {
    padding: 0;
  }
}
</style>

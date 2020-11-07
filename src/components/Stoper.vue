<template >
  <div id="stoper_outside" v-bind:class="{ 'contrast-dark': contrastDark }">
    <div class="container" id="stoper_box">
      <div class="text-center">
        <h1>Stoper online</h1>
        <div id="stoper--buttons-settings">
          <button
            class="btn btn-link" 
            @click="increaseFont">
              <font-awesome-icon icon="chevron-up" />
          </button>
          <button
            class="btn btn-link" 
            @click="decreaseFont">
              <font-awesome-icon icon="chevron-down" />
          </button>
          <button
            class="btn btn-link" 
            @click="changeContrast">
              <font-awesome-icon icon="adjust" />
          </button>
          <button
            class="btn btn-link" 
            @click="fullscreen">
              <font-awesome-icon icon="arrows-alt" />
          </button>
        </div>
        <div id="stoper_digits" v-bind:style="{ fontSize: sizeFontStoper + 'em' }">{{ t_hours }}{{ t_minutes }}:{{ t_seconds }}<small>.{{ t_miliseconds }}</small></div>
        <div id="stoper--buttons">
          <button  
            ref="startStoper"
            class="btn btn-primary" 
            v-if="!timerMili"
            @click="startStoper"
            autofocus>
              <font-awesome-icon icon="play-circle" />
          </button>
          <button
            ref="stopStoper" 
            class="btn btn-secondary" 
            v-if="timerMili"
            @click="stopStoper">
              <font-awesome-icon icon="pause-circle" />
          </button>
          <button
            class="btn btn-warning" 
            v-if="timerMili"
            @click="addRound">
              <font-awesome-icon icon="circle-notch" />
          </button>
          <button 
            class="btn btn-danger" 
            v-if="stoperRun"
            @click="resetStoper">
              <font-awesome-icon icon="stop-circle" />
          </button>
        </div>
        <div id="stoper--rounds" v-if="rounds.length">
          <table class="table">
            <tr><th>Runda</th><th>Czas</th><th>Łączny czas</th></tr>
            <tr v-for="round in rounds" v-bind:key="round.number">
              <td>{{ round.number }}</td><td>{{ round.time }}</td><td>{{ round.totalTime }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div id="stoper--description">
        <h4>Instrukcja używania stopera internetowego</h4>
        <p>Po kliknięciu niebieskiego przycisku z ikonką Start stoper rozpoczyna liczenie czasu z dokładnością do milisekundy (1/100 sekundy). Kliknięcie szarego przycisku z ikonką Pauza zatrzymuje liczenie czasu. Ponowne kiknięcie niebieskiego przycisku Start kontynuuje odliczanie. Kliknięcie żółtego przycisku z ikonką Międzyczas spowoduje dodanie międzyczasu. Pod stoperem wyświetla się lista międzyczasów: tabelka z informacją o różnicy czasu w międzyczasach oraz o całkowitym czasie. Kliknięcie czerwonego przycisku z ikonką Stop spowoduje zatrzymanie i wyzerowanie licznika czasu oraz skasowanie międzyczasów.</p>
        <p>Obecny czas i międzyczasy są zapisywane w ciasteczkach, dzięki czemu po ponownym wejściu na stronę liczenie będzie kontynuowane.</p>
        <p>Kliknięcie w strzałkę w górę zwiększa wielkość czcionki stopera a w dół - zmniejsza. Kliknięcie w przycisk z ikonką zmiany kontrastu zmnienia kolorystykę strony. Kliknięcie w przycisk z ikonką pełnego ekranu spowoduje wyświetlenie strony w pełnym ekranie. Zmiany te zostają zapisane i zachowane przy kolejnym otwarciu okna ze stoperem</p>
        <p>Projekt dostępny do pobrania na <a href="https://github.com/kamilwyremski/stoper" title="Stoper na VUE" target="_blank">https://github.com/kamilwyremski/stoper</a></p>
      </div>
      <footer class="text-center">
        <p class="small"><a href="https://blog.wyremski.pl/polityka-prywatnosci/" target="_blank" title="Polityka prywatności serwisu">Polityka prywatności</a> | Project 2019 - 2020 by <a href="http://wyremski.pl" target="_blank" title="Tworzenie Stron Internetowych">Kamil Wyremski</a></p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stoper',
  data: function () {
    return {
      stoperRun: false,
      timer: null,
      timerMili: null,
      totalTime: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
      rounds: [],
      roundTime: 0,
      sizeFontStoper: 5,
      contrastDark: false
    }
  },
  mounted: function () {
    window.addEventListener('beforeunload', this.leaving);
    if(this.$cookie.get('timer_miliseconds')>0){
      this.stoperRun = true;
      this.miliseconds = this.$cookie.get('timer_miliseconds');
    }
    if(this.$cookie.get('timer_total_time')>0){
      this.stoperRun = true;
      this.totalTime = this.$cookie.get('timer_total_time');
      if(this.totalTime>=60){
        this.hours = Math.floor(this.totalTime/3600);
        this.minutes = Math.floor((this.totalTime - Math.floor(this.totalTime/3600)*3600)/60);
        this.seconds = Math.floor((this.totalTime - Math.floor(this.totalTime/6000)*6000)/100);
      }
      if(this.$cookie.get('timer_rounds')){
        try {
          this.rounds = JSON.parse(this.$cookie.get('timer_rounds'));
        } catch (e) {
          this.rounds = [];
        }
        if(this.$cookie.get('timer_round_time')>0){
          this.roundTime = this.$cookie.get('timer_round_time');
        }
      }
    }
    if(this.$cookie.get('timer_enabled')=="true"){
      this.startStoper();
    }
    if(this.$cookie.get('timer_size_font_stoper')>0 && this.$cookie.get('timer_size_font_stoper')<20){
      this.sizeFontStoper = this.$cookie.get('timer_size_font_stoper');
    }
    if(this.$cookie.get('timer_constrast_dark')=="true"){
      this.changeContrast();
    }
  },
  methods: {
    startStoper: function() {
      this.stoperRun = true;
      if(this.miliseconds){
        setTimeout(() => {
            if(this.timerMili){
              this.totalTime++;
              this.timer = setInterval(() => this.countdown(), 1000)
            }
          }, 
          1000-this.miliseconds*10
        );
      }else{
        this.timer = setInterval(() => this.countdown(), 1000);
      }
      this.timerMili = setInterval(() => this.countdownMili(), 10);
      this.$nextTick(() => this.$refs.stopStoper.focus());
    },
    stopStoper: function() {
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerMili);
      this.timerMili = null;
      this.$nextTick(() => this.$refs.startStoper.focus());
    },
    resetStoper: function() {
      this.stoperRun = false;
      this.totalTime = this.hours = this.minutes = this.seconds = this.miliseconds = 0;
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerMili);
      this.timerMili = null;
      this.rounds = [];
      document.title = 'Stoper online';
    },
    countdown: function() {
      this.totalTime++;
    },
    countdownMili: function() {
      this.miliseconds++;
    },
    timeFormat: function (time) {
      let hours = Math.floor(time/360000);
      let minutes = Math.floor((time - Math.floor(time/360000)*360000)/6000);
      let seconds = Math.floor((time - Math.floor(time/6000)*6000)/100);
      let miliseconds = time - Math.floor(time/100)*100;
      if(hours>0){
        hours += ':';
      }else{
        hours = '';
      }
      if(minutes<10){
        minutes = '0'+minutes;
      }
      if(seconds<10){
        seconds = '0'+seconds;
      }
      if(miliseconds<10){
        miliseconds = '0'+miliseconds;
      }
      return(hours+''+minutes+':'+seconds+'.'+miliseconds);
    },
    addRound: function() {
      let totalTimeInMili = this.totalTime*100 + this.miliseconds;
      let time = totalTimeInMili - this.roundTime
      if(time < 0){
        time = 10;
      }
      this.rounds.unshift({
        number: this.rounds.length+1,
        time: this.timeFormat(time),
        totalTime: this.timeFormat(totalTimeInMili)
      });
      this.roundTime = totalTimeInMili;
    },
    increaseFont: function(){
      if(this.sizeFontStoper<20){
        this.sizeFontStoper++;
      }
    },
    decreaseFont: function(){
      if(this.sizeFontStoper>1){
        this.sizeFontStoper--;
      }
    },
    changeContrast: function(){
      this.contrastDark = !this.contrastDark
    },
    fullscreen: function(){
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    leaving: function () {
      if(this.stoperRun){
        this.$cookie.set('timer_enabled', this.timer ? true : false, 30);
        this.$cookie.set('timer_total_time', this.totalTime, 30);
        this.$cookie.set('timer_miliseconds', this.miliseconds, 30);
      }else{
        this.$cookie.delete('timer_enabled');
        this.$cookie.delete('timer_total_time');
        this.$cookie.delete('timer_miliseconds');
      }
      if(this.rounds){
        this.$cookie.set('timer_rounds', JSON.stringify(this.rounds), 30);
      }else{
        this.$cookie.delete('timer_rounds');
      }
      if(this.roundTime){
        this.$cookie.set('timer_round_time', this.roundTime, 30);
      }else{
        this.$cookie.delete('timer_round_time');
      }
      this.$cookie.set('timer_size_font_stoper', this.sizeFontStoper, 30);
      if(this.contrastDark){
        this.$cookie.set('timer_constrast_dark', true, 30);
      }else{
        this.$cookie.delete('timer_constrast_dark');
      }
    },
  },
  computed: {
    t_miliseconds: function () {
      let milisec = this.miliseconds;
      if(milisec<10){
        return '0'+milisec;
      }
      return milisec;
    },
    t_seconds: function () {
      let sec = this.seconds;
      if(sec<10){
        return '0'+sec;
      }
      return sec;
    },
    t_minutes: function () {
      let min = this.minutes;
      if(min<10){
        return '0'+min;
      }
      return min;
    },
    t_hours: function () {
      let h = this.hours;
      if(h==0){
        return '';
      }
      return h+':';
    }
  },
  watch: {
    totalTime: function () {
      this.seconds = this.totalTime % 60;
      if(this.totalTime && this.seconds==0){
        this.minutes++;
      }
    },
    miliseconds: function (val) {
      if(val==99){
        this.miliseconds = 0;
      }
    },
    seconds: function () {
      document.title = this.t_hours+this.t_minutes+':'+this.t_seconds+' - Stoper online';
    },
    minutes: function (val) {
      if(val==60){
        this.hours ++;
        this.minutes = 0;
      }
    }
  }
}
</script>

<style scoped>
#stoper_box{
  margin: auto;
  background-color: white; 
  padding: 20px;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
}
#stoper_digits{
  font-size: 5em; font-weight: bold;
}
#stoper_digits small{
  font-size: 0.3em;
}
#stoper--buttons .btn{
  margin: 5px; font-size: 1.5em;
}
#stoper--rounds{
  margin: 20px;
}
#stoper--description{
  margin-top: 40px;
}
#stoper_box footer{
  margin: 30px 20px 0;
}
#stoper_outside{
  background-color: #dfdfdf !important; padding: 40px 0;
}
#stoper_outside.contrast-dark{
  background-color: black !important; color: #e9e9e9;
}
#stoper_outside.contrast-dark #stoper_box{
  background-color: black !important;
}
#stoper_outside.contrast-dark .table{
  color: #e9e9e9;
}
@media(max-width: 576px) {
  #stoper_outside{
    padding: 0;
  }
}
</style>

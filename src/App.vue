<template>
  <div id="app">
    <Stoper/>
    <cookie-law theme="base">
      <div slot-scope="props">
        Ta strona używa ciasteczek (cookies), dzięki którym nasz serwis może działać lepiej. <a href="https://blog.wyremski.pl/polityka-prywatnosci/" target="_blank" title="Polityka prywatności serwisu" style="margin-right: 20px">Czytaj więcej</a>
        <button class="btn btn-success" @click="props.accept"><span>Rozumiem i akceptuję</span></button>
      </div>
    </cookie-law>
  </div>
</template>

<script>
import Stoper from './components/Stoper.vue'
import CookieLaw from 'vue-cookie-law'
export default {
  name: 'app',
  components: {
    Stoper,
    CookieLaw 
  }
}
</script>

<style>
</style>

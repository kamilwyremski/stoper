<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "CookieBanner",
  setup() {
    const showBanner = ref(false);

    onMounted(() => {
      const consent = localStorage.getItem("cookie-consent");
      showBanner.value = consent !== "true";
    });

    const acceptCookies = () => {
      localStorage.setItem("cookie-consent", "true");
      showBanner.value = false;
    };

    return {
      showBanner,
      acceptCookies,
    };
  },
});
</script>

<template>
  <div v-if="showBanner" class="position-fixed bottom-0 start-0 end-0 bg-dark text-white p-3 z-3">
    <div
      class="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2"
    >
      <div>
        Ta strona używa ciasteczek (cookies), dzięki którym nasz serwis może działać lepiej.
        <a
          href="https://blog.wyremski.pl/polityka-prywatnosci/"
          target="_blank"
          title="Polityka prywatności serwisu"
          >Czytaj więcej</a
        >
      </div>
      <button class="btn btn-light btn-sm" @click="acceptCookies">Rozumiem i akceptuję</button>
    </div>
  </div>
</template>

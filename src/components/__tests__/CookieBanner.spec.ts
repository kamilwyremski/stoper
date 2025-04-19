import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import type { ComponentPublicInstance } from "vue";
import CookieBanner from "../CookieBanner.vue";

describe("CookieBanner.vue", () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  let vm: InstanceType<typeof CookieBanner>;

  beforeEach(() => {
    localStorage.clear();

    wrapper = mount(CookieBanner);
    vm = wrapper.vm as InstanceType<typeof CookieBanner>;
  });

  it("pokazuje baner, gdy brak zgody w localStorage", () => {
    expect(wrapper.html()).toContain("Ta strona używa ciasteczek");
  });

  it("ukrywa baner, gdy zgoda już istnieje", async () => {
    localStorage.setItem("cookie-consent", "true");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("div[position-fixed]").exists()).toBe(false);
  });

  it("ustawia flagę i chowa baner po kliknięciu", async () => {
    const btn = wrapper.find("button.btn");
    await btn.trigger("click");
    expect(localStorage.getItem("cookie-consent")).toBe("true");
    expect(vm.showBanner).toBe(false);
    expect(wrapper.find("div[position-fixed]").exists()).toBe(false);
  });
});

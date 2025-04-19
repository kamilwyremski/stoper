import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ComponentPublicInstance } from "vue";
import Stoper from "../Stoper.vue";

describe("Stoper.vue", () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  let vm: InstanceType<typeof Stoper>;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = mount(Stoper, {
      global: {
        stubs: {
          "font-awesome-icon": true,
        },
      },
    });
    vm = wrapper.vm as InstanceType<typeof Stoper>;
  });

  it("startStoper uruchamia timer i ustawia stoperRun", async () => {
    await wrapper.find("button.btn-primary").trigger("click");
    expect(vm.stoperRun).toBe(true);
    expect(vm.startTime).not.toBeNull();
    expect(vm.timer).not.toBeNull();

    // symulujemy upływ 500 ms
    vi.advanceTimersByTime(500);
    expect(vm.totalTime).toBeGreaterThanOrEqual(500);
  });

  it("stopStoper zatrzymuje timer i ustawia stopTime", async () => {
    // najpierw start
    await wrapper.find("button.btn-primary").trigger("click");
    // potem stop
    await wrapper.find("button.btn-secondary").trigger("click");
    expect(vm.timer).toBeNull();
    expect(vm.stopTime).not.toBeNull();
  });

  it("resetStoper czyści stan", async () => {
    // ustaw jakiś stan
    await wrapper.find("button.btn-primary").trigger("click");
    vi.advanceTimersByTime(100);
    await wrapper.find("button.btn-danger").trigger("click");

    expect(vm.stoperRun).toBe(false);
    expect(vm.startTime).toBeNull();
    expect(vm.stopTime).toBeNull();
    expect(vm.totalTime).toBe(0);
    expect(vm.laps).toHaveLength(0);
  });

  it("addLap dodaje wpis do laps", async () => {
    await wrapper.find("button.btn-primary").trigger("click");
    vi.advanceTimersByTime(100);
    await wrapper.find("button.btn-warning").trigger("click");

    expect(vm.laps).toHaveLength(1);
    const lap = vm.laps[0];
    expect(lap.number).toBe(1);
    expect(lap.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(lap.totalTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

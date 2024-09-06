import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../../router";
import App from "../../App.vue";
import { describe } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

describe("router test", () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("routing", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.html()).toContain(
      "Please enter the station to view bookings",
    );
  });
});

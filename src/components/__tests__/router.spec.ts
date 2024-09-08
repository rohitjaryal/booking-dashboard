import { mount, RouterLinkStub, shallowMount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../../router";
import App from "../../App.vue";
import { describe } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import Header from "../Header.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

describe("router test for App", () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it("validate routing for App", async () => {
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

describe("router test navigation", () => {
  it("validate routing for Header navigation", async () => {
    const wrapper = shallowMount(Header, {
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "booking",
    });
  });
});

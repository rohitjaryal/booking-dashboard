import { flushPromises, mount, shallowMount } from "@vue/test-utils";
import Autocomplete from "../../components/Autocomplete.vue";
import { it } from "vitest";
import { nextTick } from "vue";

const TEST_DATA = {
  modelValue: {},
  suggestions: [{ id: "1", name: "Berlin" }],
  debounceInterval: 400,
};

describe("Tests for AutoComplete.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
  it("renders correctly with default params", () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        modelValue: {},
        suggestions: [],
      },
    });

    let inputElement = wrapper.find("input");
    let suggestionsElement = wrapper.find("ul");

    expect(inputElement.exists()).toBe(true);
    expect(inputElement.attributes().value).toContain({});
    expect(suggestionsElement.exists()).toBe(false);
  });

  it("shows suggestions when input is changed", async () => {
    const wrapper = mount(Autocomplete, {
      props: TEST_DATA,
    });

    await wrapper.find("input").setValue(TEST_DATA.suggestions[0].name);
    vi.advanceTimersByTime(TEST_DATA.debounceInterval);

    await nextTick();
    await flushPromises();

    expect(wrapper.find("ul").exists()).toBe(true);
    expect(wrapper.find("li").text()).toBe(TEST_DATA.suggestions[0].name);
  });

  it("selects a suggestion and emits update:modelValue", async () => {
    const wrapper = mount(Autocomplete, {
      props: TEST_DATA,
    });

    await wrapper.find("input").setValue(TEST_DATA.suggestions[0].name);
    vi.advanceTimersByTime(TEST_DATA.debounceInterval);

    await nextTick();
    await flushPromises();

    await wrapper.find("li").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([
      TEST_DATA.suggestions[0],
    ]);

    expect(wrapper.vm.query).toBe(TEST_DATA.suggestions[0].name);
    expect(wrapper.vm.showSuggestions).toBe(false);
  });
});

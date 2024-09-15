import { ref } from "vue";
import { FormTimes } from "./interfaces";

export const startTimes = ref<FormTimes>({
  email: 0,
  password: 0,
});

export const times = ref<FormTimes>({
  email: 0,
  password: 0,
});

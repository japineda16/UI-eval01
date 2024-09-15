interface FormTimes {
  [key: string]: number;
}

const startTimes: FormTimes = {};

export const startTiming = (input: string) => {
  startTimes[input] = Date.now();
};

export const endTiming = (input: string, times: FormTimes) => {
  const endTime = Date.now();
  times[input] = (endTime - startTimes[input]) / 1000; // Convertir a segundos
};

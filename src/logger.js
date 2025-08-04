import signale from "signale";

const logger = new signale.Signale({
  config: {
    "displayFilename": true,
    "displayScope": true,
  },
});

export default logger;

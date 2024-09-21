module.exports = {
  randomNumber: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
  randomChoice: () => Math.random() < 0.5,
};

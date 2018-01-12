class PromiseUtil {
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}

module.exports = new PromiseUtil();

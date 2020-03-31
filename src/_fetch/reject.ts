export default (reason: any, ms = 200) =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(reason);
    }, ms);
  });

export default <T>(data: T, ms = 200): Promise<T> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });

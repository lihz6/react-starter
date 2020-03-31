import fetcher from '_fetch';

export function getData(page, size) {
  return fetcher.GET(`/x000/head/${page}/${size}?page=${page}&size=${size}`);
}

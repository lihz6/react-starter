import fetcher from '_fetch';

export function getData(page, size) {
  return fetcher.GET(`/x000/menu/${page}/${size}?page=${page}&size=${size}`);
}

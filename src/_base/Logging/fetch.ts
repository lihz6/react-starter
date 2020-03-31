import fetcher from '_fetch';
import resolve from '_fetch/resolve';
import { AppStatus } from '_base/Context';
export function signin(data) {
  // return fetcher.POST(`/x000/signin`, data);
  return resolve({ appStatus: AppStatus.RUNNING });
}

export function forgetPword({ username }) {
  return fetcher
    .POST(`/x000/forget-pword`, { username })
    .then(() => `登录密码已发送，请查收你的邮箱`);
}

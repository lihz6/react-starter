import { Fetch, AppStatus } from '.';
// import fetcher from '_fetch';
import resolve from '_fetch/resolve';
export const getContext = (): Promise<Fetch> => {
  // return fetcher.GET(`/core/context`);
  return resolve({
    appStatus: AppStatus[APP_APP_STATUS] ?? AppStatus.LOGGING,
  });
};

import * as constants from "./constants";

export const put = state => ({ effect: constants.PUT, value: state });
export const call = (fn, ...args) => ({
  effect: constants.CALL,
  value: { fn, args }
});
export const get = () => ({ effect: constants.GET });

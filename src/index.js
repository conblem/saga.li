import { h, Component } from "preact";
import { createContext } from "context.li";

export * from "./effects";

import * as constants from "./constants";
import Store from "./Store";
import connect from "./connect";

const callEffect = Context => effectAndValue => {
  const effect = effectAndValue.effect;
  const value = effectAndValue.value;
  switch (effect) {
    case constants.CALL:
      return Promise.resolve(value.fn(...value.args));
    case constants.GET:
      return Promise.resolve(Context.context.value.state);
    case constants.PUT:
      return new Promise(resolve => Context.setState(value, () => resolve()));
    default:
      throw new Error("Not implemented");
  }
};

const actionToPromise = Context => {
  const callEffectWithContext = callEffect(Context);
  return fn => (...args) => {
    const generator = fn(Context.context.value.actions, ...args);
    const inner = message => {
      const yielded = generator.next(message);
      const value = yielded.value;
      const done = yielded.done;
      if (!value) {
        return Promise.resolve(message);
      }
      return callEffectWithContext(value).then(
        result => (done ? result : inner(result))
      );
    };
    return inner();
  };
};

const createStore = (state, actions) => {
  const actionToPromiseWithContext = actionToPromise(Context);
  const actionPromises = Object.entries(actions).reduce(
    (acc, indexAndValue) =>
      Object.assign(
        {
          [indexAndValue[0]]: actionToPromiseWithContext(indexAndValue[1])
        },
        acc
      ),
    {}
  );

  const Context = createContext({ actions: actionPromises, state: state });
  Context.setState = undefined;

  Context.Store = Store(Context);
  Context.connect = connect(Context.Consumer);

  return Context;
};

export default createStore;

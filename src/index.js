import { h, Component } from "preact";
import { createContext } from "context.li";

export * from "./effects";

import * as constants from "./constants";
import StoreProvider from "./StoreProvider";
import connect from "./connect";

const callEffect = context => effectAndValue => {
  const effect = effectAndValue.effect;
  const value = effectAndValue.value;
  switch (effect) {
    case constants.CALL:
      return Promise.resolve(value.fn(...value.args));
    case constants.GET:
      return Promise.resolve(context.value.state);
    case constants.PUT:
      return new Promise(resolve => context.setState(value, () => resolve()));
    default:
      throw new Error("Not implemented");
  }
};

const actionToPromise = context => {
  const callEffectWithContext = callEffect(context);
  return fn => (...args) => {
    const generator = fn(context.value.actions, ...args);
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
  const { context, Provider, Consumer } = createContext({
    state: Object.assign({}, state),
    actions: {}
  });

  const actionToPromiseWithContext = actionToPromise(context);
  context.value.actions = Object.entries(actions).reduce(
    (acc, indexAndValue) =>
      Object.assign(
        {
          [indexAndValue[0]]: actionToPromiseWithContext(indexAndValue[1])
        },
        acc
      ),
    {}
  );

  context.setState = (newState, callback) => {
    Object.assign(context.value.state, newState);
    callback();
  };

  return {
    StoreProvider: StoreProvider(context, Provider),
    connect: connect(Consumer),
    actions: context.value.actions
  };
};

export default createStore;

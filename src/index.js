import { h, Component } from "preact";
import { createContext } from "context.li";

export * from "./effects";

<<<<<<< Updated upstream
export const Context = createContext();
Context.actions = {};
Context.state = {};

export const connect = (
  mapStateToProps,
  mapActionsToProps
) => Component => props => (
  <Context.Consumer>
    {value => {
      const newProps = Object.assign({}, props);
      mapStateToProps &&
        Object.assign(newProps, mapStateToProps(value.state, props));
      mapActionsToProps &&
        Object.assign(newProps, mapActionsToProps(value.actions, props));
      return <Component {...newProps} />;
    }}
  </Context.Consumer>
);

export class Store extends Component {
  constructor(props) {
    super(props);
    Context.state = Object.assign({}, props.state);
    this.transformActionIntoPromise = this.transformActionIntoPromise.bind(
      this
    );
    this.callEffect = this.callEffect.bind(this);
  }
  transformActionIntoPromise(fn) {
    return (...args) => {
      const generator = fn(Context.actions, ...args);
      const inner = message => {
        const yielded = generator.next(message);
        const value = yielded.value;
        const done = yielded.done;
        if (!value) {
          return Promise.resolve(message);
        }
        return this.callEffect(value).then(
          result => (done ? result : inner(result))
        );
      };
      return inner();
    };
  }
  callEffect(effectAndValue) {
    const effect = effectAndValue.effect;
    const value = effectAndValue.value;
    switch (effect) {
      case constants.CALL:
        return Promise.resolve(value.fn(...value.args));
      case constants.GET:
        return Promise.resolve(Context.state);
      case constants.PUT:
        Context.state = value;
        return new Promise(resolve =>
          this.setState(undefined, () => resolve())
        );
      default:
        throw new Error("Not implemented");
    }
  }
  render() {
    Context.actions = Object.entries(this.props.actions).reduce(
      (acc, indexAndValue) =>
        Object.assign(
          {
            [indexAndValue[0]]: this.transformActionIntoPromise(
              indexAndValue[1]
            )
          },
          acc
        ),
      {}
    );
    return (
      <Context.Provider
        value={{ state: Context.state, actions: Context.actions }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
=======
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
>>>>>>> Stashed changes

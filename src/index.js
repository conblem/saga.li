import { h, Component } from "preact";
import { createContext } from "context.li";

import * as constants from "./constants";

export * from "./effects";

const Context = createContext();

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
    this.actions = {};
    this.state = Object.assign({}, props.state);
    this.transformActionIntoPromise = this.transformActionIntoPromise.bind(
      this
    );
    this.callEffect = this.callEffect.bind(this);
  }
  transformActionIntoPromise(fn) {
    return (...args) => {
      const generator = fn(this.actions, ...args);
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
        return Promise.resolve(this.state);
      case constants.PUT:
        return new Promise(resolve => this.setState(value, () => resolve()));
      default:
        throw new Error("Not implemented");
    }
  }
  render() {
    this.actions = Object.entries(this.props.actions).reduce(
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
      <Context.Provider value={{ state: this.state, actions: this.actions }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

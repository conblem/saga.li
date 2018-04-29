import { Component } from "preact";

import * as constants from "./constants";

export * from "./effects";

class Store extends Component {
  actions = {};
  state = this.props.state;
  proxy = fn => (...args) => {
    const generator = fn(this.actions, ...args);
    const inner = message => {
      const { value, done } = generator.next(message);
      if (!value) {
        return Promise.resolve(message);
      }
      return this.result(value).then(result => (done ? result : inner(result)));
    };
    return inner();
  };
  result = ({ effect, value }) => {
    switch (effect) {
      case constants.CALL:
        const { fn, args } = value;
        return Promise.resolve(fn(...args));
      case constants.GET:
        return Promise.resolve(this.state);
      case constants.PUT:
        return new Promise(resolve => this.setState(value, () => resolve()));
      default:
        throw new Error("Not implemented");
    }
  };
  getChildContext = () => {
    const { proxy, props, state } = this;
    this.actions = Object.entries(props.actions).reduce(
      (acc, [index, value]) => ({
        [index]: proxy(value),
        ...acc
      }),
      {}
    );
    return { state, actions: this.actions };
  };
  render() {
    return this.props.children[0];
  }
}

export default Store;

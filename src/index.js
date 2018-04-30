import { Component } from "preact";

import * as constants from "./constants";

export * from "./effects";

class Store extends Component {
  constructor(props) {
    super(props);
    this.actions = {};
    this.state = props.state;
    this.transformActionIntoPromise = this.transformActionIntoPromise.bind(
      this
    );
    this.callEffect = this.callEffect.bind(this);
  }
  transformActionIntoPromise(fn) {
    return (...args) => {
      const generator = fn.apply(undefined, [this.actions].concat(arguments));
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
        console.log(value);
        return Promise.resolve(value.fn.apply(undefined, value.args));
      case constants.GET:
        return Promise.resolve(this.state);
      case constants.PUT:
        return new Promise(resolve => this.setState(value, () => resolve()));
      default:
        throw new Error("Not implemented");
    }
  }
  getChildContext() {
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
    return { state: this.state, actions: this.actions };
  }
  render() {
    return this.props.children[0];
  }
}

export default Store;

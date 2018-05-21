import { h, Component } from "preact";

const StoreProvider = (context, Provider) =>
  class StoreProvider extends Component {
    constructor(props) {
      super(props);
      context.setState = this.setState.bind(this);
      this.state = context.value.state;
    }
    render() {
      return (
        <Provider value={{ state: this.state, actions: context.value.actions }}>
          {this.props.children}
        </Provider>
      );
    }
  };

export default StoreProvider;

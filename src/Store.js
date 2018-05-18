import { h, Component } from "preact";

const Store = Context =>
  class Store extends Component {
    constructor(props) {
      super(props);
      Context.setState = this.setState.bind(this);
      this.state = props.state || Context.context.value.state;
    }
    componentDidUpdate(oldProps) {
      if (this.props.state !== oldProps.state) {
        this.setState({ state: this.props.state });
      }
    }
    render() {
      console.log(Context);
      return (
        <Context.Provider
          value={{ state: this.state, actions: Context.context.value.actions }}
        >
          {this.props.children}
        </Context.Provider>
      );
    }
  };

export default Store;

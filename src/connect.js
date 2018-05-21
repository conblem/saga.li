import { h } from "preact";

const connect = Consumer => {
  return (mapStateToProps, mapActionsToProps) => Component => props => (
    <Consumer>
      {value => {
        const newProps = Object.assign({}, props);

        if (mapStateToProps) {
          Object.assign(newProps, mapStateToProps(value.state, props));
        }
        if (mapActionsToProps) {
          Object.assign(newProps, mapActionsToProps(value.actions, props));
        }

        return <Component {...newProps} />;
      }}
    </Consumer>
  );
};

export default connect;

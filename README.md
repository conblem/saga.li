# saga.li

[![codecov](https://codecov.io/gh/conblem/saga.li/branch/master/graph/badge.svg)](https://codecov.io/gh/conblem/saga.li)
[![Build Status](https://circleci.com/gh/conblem/saga.li.svg?style=shield)](https://circleci.com/gh/conblem/saga.li)

<!---
import { render } from "preact";
import { Store, connect, put, get } from "saga.li";


const mapStateToProps = ({ count }) => ({ count });
const mapActionsToProps = ({ increment }) => ({ increment });

const Counter = connect(mapStateToProps, mapActionsToProps)(
  ({ increment, count }) => (
    <div>
      <button onclick={increment}>+</button>
      {count}
    </div>
  )
);


const state = {
  count: 0
};
const actions = {
  increment: function*() {
    const { count } = yield get();
    yield put({ count: count + 1 });
  }
};

const App = () => (
  <Store state={state} actions={actions}>
    <Counter />
  </Store>
);


render(<App />, document.body);
-->

![Example](https://pbs.twimg.com/media/Dc6sz4UU0AAQqno.png)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details

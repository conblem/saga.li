const { h } = require("preact");
const renderToString = require("preact-render-to-string");
const { render } = require("preact");

const { put, get, call, default: Store } = require("../dist/");

const Main = (props, { state, actions }) => {
  if (state.count === 10) {
    actions.increment();
  }
  return state.count;
};

const state = { count: 10 };
const actions = {
  increment: function*() {
    const { count } = yield get();
    yield put({ count: count + 1 });
  },
  callTest: function*(actions, asyncCountGetter, resolve) {
    const count = yield call(asyncCountGetter);
    resolve(count);
  },
  actionInAction: function*({ increment }, resolve) {
    yield call(increment);
    const { count } = yield get();
    resolve(count);
  }
};

describe("test", () => {
  test("render state to html", () => {
    const actual = renderToString(
      <Store state={state} actions={actions}>
        <Main />
      </Store>
    );

    expect(actual).toBe("10");
  });
  test("put and get", async () => {
    render(
      <Store state={state} actions={actions}>
        <Main />
      </Store>,
      document.body
    );
    expect(document.body.innerHTML).toBe("11");
  });
  test("call", async () => {
    // function that returns promise with value 20
    const asyncCountGetter = Promise.resolve.bind(Promise, 20);
    const promise = new Promise(resolve => (this.resolve = resolve));
    const Component = (props, { actions }) => {
      actions.callTest(asyncCountGetter, this.resolve);
    };
    render(
      <Store state={state} actions={actions}>
        <Component />
      </Store>,
      document.body
    );
    const newCount = await promise;
    expect(newCount).toBe(20);
  });
  /*test("action in action", async () => {
    const promise = new Promise(resolve => (this.resolve = resolve));
    const Component = (props, { actions }) => {
      actions.actionInAction(this.resolve);
    };
    render(
      <Store state={state} actions={actions}>
        <Component />
      </Store>,
      document.body
    );
    const count = await promise;
    expect(count).toBe(11);
  });*/
});

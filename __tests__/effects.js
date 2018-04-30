const { h } = require("preact");
const { render } = require("preact");

const { put, get, call, default: Store } = require("../dist/");

const state = { count: 10 };
const actions = {
  increment: function* () {
    const { count } = yield get();
    yield put({ count: count + 1 });
  },
  callTest: function* (actions, asyncCountGetter, resolve) {
    const count = yield call(asyncCountGetter);
    resolve(count);
  },
  actionInAction: function* ({ increment }) {
    yield call(increment);
    yield call(increment);
    yield get();
  }
};

describe("effects", () => {
  beforeEach(() => document.body.innerHTML = "")

  test("put and get", async () => {
    const promise = new Promise(resolve => this.resolve = resolve)
    const Component = (props, { actions, state }) => {
      if (state.count === 10) {
        actions.increment().then(this.resolve)
      }
      return state.count
    }
    render(
      <Store state={state} actions={actions}>
        <Component />
      </Store>,
      document.body
    );
    await promise
    expect(document.body.innerHTML).toBe("11");
  });

  test("call", async () => {
    const asyncCountGetter = () => Promise.resolve(20)
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
    const count = await promise;
    expect(count).toBe(20);
  });

  test("action in action", async () => {
    const promise = new Promise(resolve => (this.resolve = resolve));
    const Component = (props, { actions, state }) => {
      if (state.count === 10) {
        actions.actionInAction().then(({ count }) => this.resolve(count));
      }
    };
    render(
      <Store state={state} actions={actions}>
        <Component />
      </Store>,
      document.body
    );
    const count = await promise;
    expect(count).toBe(12);
  });
});

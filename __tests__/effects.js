const { h } = require("preact");
const { render } = require("preact");

const { put, get, call, Store, connect } = require("../dist/");

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
    yield call(increment);
    const { count } = yield get();
    resolve(count);
  }
};

describe("effects", () => {
  test("put and get", async () => {
    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect((props, { count }, { increment }) => {
      if (count === 10) {
        increment().then(resolveCount);
      }
      return count;
    });
    render(
      <Store state={state} actions={actions}>
        <Component />
      </Store>,
      document.body
    );
    await promise;
    expect(document.body.innerHTML).toBe("11");
  });

  test("call", async () => {
    const asyncCountGetter = () => Promise.resolve(20);
    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect((props, state, { callTest }) => {
      callTest(asyncCountGetter, resolveCount);
    });
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
    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect((props, { count }, { actionInAction }) => {
      if (count === 10) {
        actionInAction(resolveCount);
      }
    });
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

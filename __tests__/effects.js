const { h } = require("preact");
const { render } = require("preact");

const { put, get, call, default: createStore } = require("../dist/");

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
    const { StoreProvider, connect } = createStore(state, actions);

    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect(Object, Object)(({ count, increment }) => {
      if (count === 10) {
        increment().then(resolveCount);
      }
      return count;
    });
    render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
      document.body
    );
    await promise;
    expect(document.body.innerHTML).toBe("11");
  });

  test("call", async () => {
    const { StoreProvider, connect } = createStore(state, actions);

    const asyncCountGetter = () => Promise.resolve(20);
    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect(Object, Object)(({ callTest }) => {
      callTest(asyncCountGetter, resolveCount);
    });
    render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
      document.body
    );
    const count = await promise;
    expect(count).toBe(20);
  });

  test("action in action", async () => {
    const { StoreProvider, connect } = createStore(state, actions);

    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));
    const Component = connect(Object, Object)(({ count, actionInAction }) => {
      if (count === 10) {
        actionInAction(resolveCount);
      }
    });
    render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
      document.body
    );
    const count = await promise;
    expect(count).toBe(12);
  });
});

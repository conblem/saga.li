const { render, h } = require("preact");

const { default: createStore, put, get } = require("../dist");

const state = {
  count: 0
};

const actionsEntry = {
  increment: function*() {
    const { count } = yield get();
    yield put({ count: count + 1 });
  }
};

describe("ssr", () => {
  it("should run action without rendering", async () => {
    const { StoreProvider, connect, actions } = createStore(
      state,
      actionsEntry
    );

    const Component = connect(Object)(({ count }) => count);

    await actions.increment();
    await actions.increment();

    render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
      document.body
    );

    expect(document.body.innerHTML).toBe("2");
  });
});

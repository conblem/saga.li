const { h } = require("preact");
const { render } = require("preact");

const { default: createStore } = require("../dist");

const state = { count: 10 };

test("render state to html", () => {
  const { connect, StoreProvider } = createStore(state, {});
  const Component = connect(Object)(({ count }) => count);
  render(
    <StoreProvider>
      <Component />
    </StoreProvider>,
    document.body
  );
  expect(document.body.innerHTML).toBe("10");
});

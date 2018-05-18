const { h } = require("preact");
const { render } = require("preact");

const { default: createStore } = require("../dist");

const state = { count: 10 };
const { connect, Store } = createStore(state, {});

test("render state to html", () => {
  const Component = connect(Object)(({ count }) => count);
  render(
    <Store state={state} actions={{}}>
      <Component />
    </Store>,
    document.body
  );
  expect(document.body.innerHTML).toBe("10");
});

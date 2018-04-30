const { h } = require("preact");
const { render } = require("preact");

const { put, get, call, default: Store } = require("../dist/");

const state = { count: 10 };

test("render state to html", () => {
  const Component = (props, { state }) => state.count;
  render(
    <Store state={state} actions={{}}>
      <Component />
    </Store>,
    document.body
  );
  expect(document.body.innerHTML).toBe("10");
});

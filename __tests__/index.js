const { h } = require("preact");
const { render } = require("preact");

const { Store, connect } = require("../dist/");

const state = { count: 10 };

test("render state to html", () => {
  const Component = connect((props, { count }) => count);
  render(
    <Store state={state} actions={{}}>
      <Component />
    </Store>,
    document.body
  );
  expect(document.body.innerHTML).toBe("10");
});

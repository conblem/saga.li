const { h } = require("preact");
const { render } = require("preact");

const { Store, Connect } = require("../dist/");

const state = { count: 10 };

test("render state to html", () => {
  const Component = Connect((props, state) => {
    debugger;
    console.log(state);
    return state.count;
  });
  render(
    <Store state={state} actions={{}}>
      <Component />
    </Store>,
    document.body
  );
  expect(document.body.innerHTML).toBe("10");
});

const { h, render } = require("preact");
const { Store, connect, get, put } = require("../dist");

const state = { count: 0 };
const actions = {
  increment: function*() {
    const { count } = yield get();
    yield put({ count: count + 1 });
  }
};

describe("connect", () => {
  beforeEach(() => (document.body.innerHTML = ""));

  it("should mapStateToProps", () => {
    const mapStateToProps = ({ count }) => ({
      countPlusOne: count + 1
    });
    const App = connect(mapStateToProps)(({ countPlusOne }) => {
      expect(countPlusOne).toBe(1);
    });

    render(
      <Store state={state} actions={actions}>
        <App />
      </Store>,
      document.body
    );
  });

  it("should mapActionsToProps", async () => {
    let resolveCount;
    const promise = new Promise(resolve => (resolveCount = resolve));

    const mapStateToProps = ({ count }) => ({ count });
    const mapActionsToProps = ({ increment }) => ({
      incrementOnlyUneven(count) {
        if (count % 2 !== 0) {
          return increment();
        }
        return Promise.resolve();
      }
    });
    const App = connect(mapStateToProps, mapActionsToProps)(
      ({ count, incrementOnlyUneven }) => {
        incrementOnlyUneven(count).then(resolveCount);
        return count;
      }
    );

    render(
      <Store state={state} actions={actions}>
        <App />
      </Store>,
      document.body
    );
    await promise;
    expect(document.body.innerHTML).toBe("0");
  });

  it("mapStateToProps should receive ownProps", () => {
    const mapStateToProps = (state, { testProp }) => {
      expect(testProp).toBe("I got passed damn");
    };
    const App = connect(mapStateToProps)(({ testProp }) => testProp);

    render(
      <Store state={state} actions={actions}>
        <App testProp="I got passed damn" />
      </Store>,
      document.body
    );

    expect(document.body.innerHTML).toBe("I got passed damn");
  });

  it("mapActionsToProps should receive ownProps", () => {
    const mapActionsToProps = (props, { testProp }) => {
      expect(testProp).toBe("I got passed damn");
    };
    const App = connect(Object, mapActionsToProps)(({ testProp }) => testProp);

    render(
      <Store state={state} actions={actions}>
        <App testProp="I got passed damn" />
      </Store>,
      document.body
    );

    expect(document.body.innerHTML).toBe("I got passed damn");
  });
});

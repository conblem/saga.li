const { h, render } = require("preact");
const { default: createStore, get, put } = require("../dist");

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
    const { StoreProvider, connect } = createStore(state, actions);

    const mapStateToProps = ({ count }) => ({
      countPlusOne: count + 1
    });
    const App = connect(mapStateToProps)(({ countPlusOne }) => {
      expect(countPlusOne).toBe(1);
    });

    render(
      <StoreProvider>
        <App />
      </StoreProvider>,
      document.body
    );
  });

  it("should mapActionsToProps", async () => {
    const { StoreProvider, connect } = createStore(state, actions);

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
      <StoreProvider>
        <App />
      </StoreProvider>,
      document.body
    );
    await promise;
    expect(document.body.innerHTML).toBe("0");
  });

  it("mapStateToProps should receive ownProps", () => {
    const { StoreProvider, connect } = createStore(state, actions);

    const mapStateToProps = (state, { testProp }) => {
      expect(testProp).toBe("I got passed damn");
    };
    const App = connect(mapStateToProps)(({ testProp }) => testProp);

    render(
      <StoreProvider>
        <App testProp="I got passed damn" />
      </StoreProvider>,
      document.body
    );

    expect(document.body.innerHTML).toBe("I got passed damn");
  });

  it("mapActionsToProps should receive ownProps", () => {
    const { StoreProvider, connect } = createStore(state, actions);

    const mapActionsToProps = (props, { testProp }) => {
      expect(testProp).toBe("I got passed damn");
    };
    const App = connect(Object, mapActionsToProps)(({ testProp }) => testProp);

    render(
      <StoreProvider>
        <App testProp="I got passed damn" />
      </StoreProvider>,
      document.body
    );

    expect(document.body.innerHTML).toBe("I got passed damn");
  });
});

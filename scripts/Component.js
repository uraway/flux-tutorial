import React from 'react';
import ActionCreator from './ActionCreator';
import Store from './Store';
import EventEmitter from './EventEmitter';

let dispatcher = new EventEmitter();
let action = new ActionCreator(dispatcher);
let store = new Store(dispatcher);

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: store.getCount()};
    // <- Observe store's CHANGE
    store.on("CHANGE", () => {
      this._onChange();
    });
  }
  _onChange() {
    this.setState({count: store.getCount()});
  }
  tick() {
    action.countUp(this.state.count + 1);
  }

  render() {
    return (
      <div>
        <button onClick={this.tick.bind(this)}>Count Up</button>
        <p>
          Count: {this.state.count}
        </p>
      </div>
    );
  }
}

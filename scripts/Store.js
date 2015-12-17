import Emitter from './EventEmitter';

export default class Store extends Emitter {
  // dispatcherを受け取る
  constructor(dispatcher) {
    super();
    this.count = 0;

    dispatcher.on("countUp", this.onCountUp.bind(this));
  }
  getCount() {
    // stateを取り出すメソッド
    return this.count;
  }
  onCountUp(count) {
    // dispatcherがemitされると呼ばれる
    this.count = count;
    this.emit("CHANGE");
  }
}

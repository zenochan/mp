export class Event {
  events = {};

  addEventListener(type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  trigger(...args) {
    let type = args[0];
    let params = args.slice(1);
    if (!!this.events[type]) {
      this.events[type].forEach((listener) => {
        try {
          listener.apply(null, params);
        } catch (e) {
          console.error(e);
        }
      });
    }

  }
}

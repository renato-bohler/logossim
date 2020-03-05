import '@testing-library/jest-dom/extend-expect';

window.URL.createObjectURL = () => '';

window.Worker = class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }

  addEventListener(type, fn) {
    if (type === 'message') {
      this.onmessage = fn;
    }
  }

  removeEventListener(type) {
    if (type === 'message') {
      this.onmessage = () => {};
    }
  }
};

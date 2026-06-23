import { DArray } from "./DynamicArray.js";

class CircularQueue {
  #data;
  #front;
  #size;
  constructor(capacity = 8) {
    if (!Number.isInteger(capacity) || capacity < 0)
      throw new Error("The capacity must be a positive integer.");

    this.#data = new DArray(capacity);
    this.#front = 0;
    this.#size = 0;
  }

  /* ================= Basic State ================= */

  size() {
    return this.#size;
  }

  capacity() {
    return this.#data.capacity;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    for (let i = this.#front; i < this.#size + this.#front; ++i) {
      const idx = i % this.#data.capacity;
      this.#data[idx] = undefined;
    }
    this.#front = 0;
    this.#size = 0;
  }

  /* ================= Core Queue Operations ================= */

  enqueue(value) {
    if (this.#size === this.#data.capacity) this.#grow();

    const idx = (this.#front + this.#size) % this.#data.capacity;
    this.#data[idx] = value;
    ++this.#size;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");

    const val = this.#data[this.#front];
    this.#data[this.#front] = undefined;
    this.#front = (this.#front + 1) % this.#data.capacity;
    --this.#size;
    return val;
  }

  front() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");
    return this.#data[this.#front];
  }

  back() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");

    const idx = (this.#front + this.#size - 1) % this.#data.capacity;
    return this.#data[idx];
  }

  /* ================= Internal Resize ================= */

  #grow() {
    const newCap = this.#data.capacity * this.#data.CAP_EXPONENT;
    const newCQueue = new DArray(newCap);

    for (let i = 0; i < this.#size; ++i) {
      const localIdx = (this.#front + i) % this.#data.capacity;
      newCQueue[i] = this.#data[localIdx];
    }

    this.#front = 0;
    this.#data = newCQueue;
  }

  /* ================= Utilities ================= */

  toArray() {
    const arr = new Array(this.#size);
    for (let i = 0; i < this.#size; ++i) {
      const idx = (this.#front + i) % this.#data.capacity;
      arr[i] = this.#data[idx];
    }
    return arr;
  }

  toString() {
    const arr = this.toArray();
    return arr.toString();
  }

  [Symbol.iterator]() {
    let i = 0;
    let idx = this.#front;
    return {
      next: () => {
        if (i < this.#size) {
          idx %= this.#data.capacity;
          ++i;
          return { value: this.#data[idx++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },

      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

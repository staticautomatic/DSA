import { DArray } from "./DynamicArray.js";

class CircularQueue {
  #data;
  #front;
  #size;
  constructor(capacity = 8) {
    if (!Number.isInteger(capacity) || capacity <= 0)
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
      this.#data.setValue(idx, undefined);
    }
    this.#front = 0;
    this.#size = 0;
  }

  /* ================= Core Queue Operations ================= */

  enqueue(value) {
    if (this.#size === this.#data.capacity) this.#grow();

    const idx = (this.#front + this.#size) % this.#data.capacity;
    this.#data.setValue(idx, value);
    ++this.#size;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");

    const val = this.#data.at(this.#front);
    this.#data.setValue(this.#front, undefined);
    this.#front = (this.#front + 1) % this.#data.capacity;
    --this.#size;
    return val;
  }

  front() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");
    return this.#data.at(this.#front);
  }

  back() {
    if (this.isEmpty()) throw new Error("The circular queue is empty.");

    const idx = (this.#front + this.#size - 1) % this.#data.capacity;
    return this.#data.at(idx);
  }

  /* ================= Internal Resize ================= */

  #grow() {
    const newCap = this.#data.capacity * 2;
    const newCQueue = new DArray(newCap);

    for (let i = 0; i < this.#size; ++i) {
      const localIdx = (this.#front + i) % this.#data.capacity;
      newCQueue.push_back(this.#data.at(localIdx));
    }

    this.#front = 0;
    this.#data = newCQueue;
  }

  /* ================= Utilities ================= */

  toArray() {
    const arr = new Array(this.#size);
    for (let i = 0; i < this.#size; ++i) {
      const idx = (this.#front + i) % this.#data.capacity;
      arr[i] = this.#data.at(idx);
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
    const size = this.#size;
    const cap = this.#data.capacity;
    return {
      next: () => {
        if (i < size) {
          idx %= cap;
          ++i;
          return { value: this.#data.at(idx++), done: false };
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

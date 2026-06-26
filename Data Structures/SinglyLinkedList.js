class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

class SinglyLinkedList {
    #head;
    #size;

    constructor(value) {
        if (value !== undefined) {
            this.#head = new Node(value);
            this.#size = 1;
        } else {
            this.#head = null;
            this.#size = 0;
        }
    }

    empty() {
        return this.#size === 0;
    }

    size() {
        return this.#size;
    }

    clear() {
        this.#head = null;
        this.#size = 0;
    }

    front() {
        if (this.empty()) throw new Error("The list is empty.");
        return this.#head.value;
    }

    back() {
        if (this.empty()) throw new Error("The list is empty.");
        let curr = this.#head;
        while (curr.next) {
            curr = curr.next;
        }
        return curr.value;
    }

    at(index) {
        if (!Number.isInteger(index)) throw new Error("The index must be an integer.");
        if (index < 0 || index >= this.#size) throw new Error("Index Error: Out of range.");

        let curr = this.#head;
        while (index) {
            curr = curr.next;
            --index;
        }

        return curr.value;
    }

    pushFront(value) {
        const newNode = new Node(value);
        newNode.next = this.#head;
        this.#head = newNode;
        ++this.#size;
    }

    pushBack(value) {
        const newNode = new Node(value);
        if (this.empty()) {
            this.#head = newNode;
        } else {
            let curr = this.#head;
            while (curr.next) {
                curr = curr.next;
            }
            curr.next = newNode;
        }
        ++this.#size;
    }

    popFront() {
        if (this.empty()) throw new Error("The list is empty.");
        const val = this.#head.value;
        this.#head = this.#head.next;
        --this.#size;
        return val;
    }

    popBack() {
        if (this.empty()) throw new Error("The list is empty.");
        let val;
        if (!this.#head.next) {
            val = this.#head.value;
            this.#head = null;
        } else {
            let curr = this.#head;
            while (curr.next.next) {
                curr = curr.next;
            }
            val = curr.next.value;
            curr.next = null;
        }
        --this.#size;
        return val;
    }

    insert(index, value) {
        if (!Number.isInteger(index)) throw new Error("The index must be an integer.");
        if (index < 0 || index > this.#size) throw new Error("Index Error: Out of range.");
        if (index === 0) return this.pushFront(value);
        
        let curr = this.#head;
        const newNode = new Node(value);
        while (index !== 1) {
            curr = curr.next;
            --index;
        }
        newNode.next = curr.next;
        curr.next = newNode;
        ++this.#size;
    }

    erase(index) {
        if (!Number.isInteger(index)) throw new Error("The index must be an integer.");
        if (index < 0 || index >= this.#size) throw new Error("Index Error: Out of range.");
        if (index === this.#size - 1) return this.popBack();
        else if (index === 0) return this.popFront();

        let curr = this.#head;
        while (index !== 1) {
            curr = curr.next;
            --index;
        }
        const val = curr.next.value;
        curr.next = curr.next.next;
        --this.#size;
        return val;
    }

    find(value) {
        let idx = 0;
        let curr = this.#head;
        while (curr) {
            if (curr.value === value) return idx;
            curr = curr.next;
            ++idx;
        }
        return -1;
    }

    contains(value) {
        let curr = this.#head;
        while (curr) {
            if (curr.value === value) return true;
            curr = curr.next;
        }
        return false;
    }

    toArray() {
        let arr = new Array(this.#size);
        let curr = this.#head;
        let idx = 0;
        while (curr) {
            arr[idx++] = curr.value;
            curr = curr.next;
        }
        return arr;
    }

    reverse() {
        if (this.empty() || !this.#head.next) return this.#head;
        let prev = null;
        let curr = this.#head;

        while (curr) {
            const next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        this.#head = prev;
    }

    *[Symbol.iterator]() {
        let curr = this.#head;
        while (curr) {
            yield curr.value;
            curr = curr.next;
        }
    }

    *entries() {
        let curr = this.#head;
        let idx = 0;
        while (curr) {
            yield [idx++, curr.value];
            curr = curr.next;
        }
    }
}

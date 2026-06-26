class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

class CyclicSLL {
    #head;
    #size;
    constructor(value) {
        if(value === undefined) {
            this.#head = null;
            this.#size = 0;
        } else {
            const newNode = new Node(value);
            newNode.next = newNode;
            this.#head = newNode;
            this.#size = 1;
        }
    }

    empty() {
        return this.#size === 0;
    }

    size() {
        return this.#size;
    }

    clear() {
        if(this.empty()) throw new Error("The list is already empty.");
        this.#head = null;
        this.#size = 0;
    }

    front() {
        if(this.empty()) throw new Error("The list is empty.");
        return this.#head.value;
    }

    back() {
        if(this.empty()) throw new Error("The list is empty.");
        if(this.#head.next === this.#head) return this.front();
        let curr = this.#head;
        while(curr.next !== this.#head) {
            curr = curr.next;
        }
        return curr.value;
    }

    at(index) {
        if(!Number.isInteger(index)) throw new Error("Invalid index: Index must be an integer.");
        if(index < 0 || index >= this.#size) throw new Error("Index Error: Out of range.");
        if(index === 0) return this.#head.value;

        let curr = this.#head;
        while(index) {
            curr = curr.next;
            --index;
        }
        return curr.value;
    }

    pushFront(value) {
        let newNode = new Node(value);
        if(this.#head === null) {
            newNode.next = newNode;
        } else{
            let curr = this.#head;
            while(curr.next !== this.#head) curr = curr.next;
            newNode.next = this.#head;
            curr.next = newNode;
        
        }
        this.#head = newNode;
        ++this.#size;
    }

    pushBack(value) {
        let newNode = new Node(value);
        if(this.#head === null) {
            this.#head = newNode;
            newNode.next = newNode;
        } else {
            let curr = this.#head;
            while(curr.next !== this.#head) {
                curr = curr.next;
            }
            curr.next = newNode;
            newNode.next = this.#head;
        }
        ++this.#size;
    }

    popFront() {
        if(this.empty()) throw new Error("The list is empty.");
        const val = this.#head.value;
        if(this.#head.next === this.#head) {
            this.#head = null;            
        } else {
            let curr = this.#head;
            while(curr.next !== this.#head) curr = curr.next;
            this.#head = this.#head.next;
            curr.next = this.#head;
        }
        --this.#size;
        return val;
    }

    popBack() {
        if(this.empty()) throw new Error("The list is empty.");
        let val = 0;
        if(this.#head.next === this.#head) {
            val = this.#head.value;
            this.#head = null;
        } else {
            let curr = this.#head;
            while(curr.next.next !== this.#head) {
                curr = curr.next;
            }
            val = curr.next.value;
            curr.next = this.#head;
        }
        --this.#size;
        return val;
    }

    insert(index, value) {
        if(!Number.isInteger(index)) throw new Error("Invalid index: Index must be an integer.");
        if(index < 0 || index > this.#size) throw new Error("Index Error: Out of range.");
        if(index === 0) return this.pushFront(value);
        let newNode = new Node(value);
        let curr = this.#head;
        while(index !== 1) {
            curr = curr.next;
            --index;
        }
        newNode.next = curr.next;
        curr.next = newNode;
        ++this.#size;
    }

    erase(index) {
        if(!Number.isInteger(index)) throw new Error("Invalid index: Index must be an integer.");
        if(index < 0 || index >= this.#size) throw new Error("Index Error: Out of range.");
        if(index === 0) return this.popFront();
        else if(index === this.#size - 1) return this.popBack();

        let curr = this.#head;
        while(index !== 1) {
            curr = curr.next;
            --index;
        }
        const val = curr.next.value;
        curr.next = curr.next.next;
        --this.#size;
        return val;
    }

    find(value) {
        if(this.empty()) throw new Error("The list is empty.");
        let idx = 0;
        let curr = this.#head;

        while(idx < this.#size) {
            if(curr.value === value) return idx;
            curr = curr.next;
            ++idx;
        }
        return -1;
    }

    contains(value) {
        if(this.empty()) throw new Error("The list is empty.");
        if(this.#head.next === this.#head) {
            if(this.#head.value === value) return true;
            return false;
        }
        let curr = this.#head;
        for(let i = 0; i < this.#size; ++i) {
            if(curr.value === value) return true;
            curr = curr.next;
        }
        return false;
    }

    toArray() {
        let arr = new Array(this.#size);
        let curr = this.#head;
        for(let i = 0; i < this.#size; ++i) {
            arr[i] = curr.value;
            curr = curr.next;
        }
        return arr;
    }

    reverse() {
        if(this.empty()) throw new Error("The list is empty.");
        if(this.#head.next === this.#head) return;

        let prev = this.#head;
        let curr = this.#head.next;

        while(curr !== this.#head) {
            let next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        curr.next = prev;
        this.#head = prev;
    }

    *[Symbol.iterator]() {
        let idx = 0;
        let curr = this.#head;
        while(idx < this.#size) {
            yield curr.value;
            curr = curr.next;
            ++idx;
        }
    }

    *entries() {
        let idx = 0;
        let curr = this.#head;
        while(idx < this.#size) {
            yield [idx, curr.value];
            curr = curr.next;
            ++idx;
        }
    }
}

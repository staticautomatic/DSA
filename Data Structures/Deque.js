export class BucketedDeque {
    // === State ===
    #everyBucketsLength = 8;
    #bucketSize;
    #buckets;
    #frontBucket;
    #backBucket;
    #frontIndex;
    #backIndex;
    #size;

    /**
     * @param {number} [bucketSize]
     */
    constructor(bucketSize) {
        this.#init(bucketSize);
    }

    #init(bucketSize = 4) {
        if(!Number.isInteger(bucketSize) || bucketSize < 4) throw new Error("...");
        if(bucketSize % 2) {
            this.#bucketSize = bucketSize + 1;
        } else {
            this.#bucketSize = bucketSize;
        }
        this.#buckets = new Array(this.#bucketSize);
        for(let i = 0; i < this.#buckets.length; ++i) {
            this.#buckets[i] = new Array(this.#everyBucketsLength).fill(undefined);
        }
        let mid = this.#bucketSize / 2;
        this.#frontBucket = mid - 1;
        this.#backBucket = mid;
        this.#frontIndex = this.#everyBucketsLength - 1;
        this.#backIndex = 0;
        this.#size = 0;
    }

    // === Core operations ===
    
    /**
     * @param {*} value 
     */
    push_front(value) {
        this.#buckets[this.#frontBucket][this.#frontIndex] = value;
        if(--this.#frontIndex === -1) {
            this.#frontIndex = this.#everyBucketsLength - 1;
            if(--this.#frontBucket === -1) {
                this._ensureBucket(true);
            }
        }
        ++this.#size;
    }

    /**
     * @param {*} value 
     */
    push_back(value) {
        this.#buckets[this.#backBucket][this.#backIndex] = value;
        if(++this.#backIndex === this.#everyBucketsLength) {
            this.#backIndex = 0;
            if(++this.#backBucket === this.#bucketSize) {
                this._ensureBucket();
            }
        }
        ++this.#size;
    }

    /**
     * @returns {*}
     * @throws {RangeError} If the deque is empty.
     */
    pop_front() {
        if(this.isEmpty()) throw new RangeError("The deque is empty");
        if(++this.#frontIndex === this.#everyBucketsLength) {
            this.#frontIndex = 0;
            ++this.#frontBucket;
        }
        let val = this.#buckets[this.#frontBucket][this.#frontIndex];
        this.#buckets[this.#frontBucket][this.#frontIndex] = undefined;
        --this.#size;
        return val;
    }

    /**
     * @returns {*}
     * @throws {RangeError} If the deque is empty.
     */
    pop_back() {
        if(this.isEmpty()) throw new RangeError("The deque is empty");
        if(--this.#backIndex === -1) {
            this.#backIndex = this.#everyBucketsLength - 1;
            --this.#backBucket;
        }
        let val = this.#buckets[this.#backBucket][this.#backIndex];
        this.#buckets[this.#backBucket][this.#backIndex] = undefined;
        --this.#size;
        return val;
    }

    // === Access ===

    /**
     * @returns {*|undefined}
     */
    front() {
        if(this.isEmpty()) return undefined;
        return this.at(0);
    }

    /**
     * @returns {*|undefined}
     */
    back() {
        if(this.isEmpty()) return undefined;
        return this.at(this.#size - 1);
    }

    // === Utilities ===

    /**
     * @returns {void}
     */
    clear() {
        this.#init();
    }

    /**
     * @returns {number}
     */
    size() {
        return this.#size;
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.#size === 0;
    }

    /**
     * @returns {Array}
     */
    toArray() {
        let newArray = [];
        for(let i = 0; i < this.#size; ++i) {
            newArray.push(this.at(i));
        }
        return newArray;
    }

    /**
     * @param {number} globalIndex 
     * @returns {*|undefined}
     */
    at(globalIndex) {
        const res = this._bucketIndex(globalIndex);

        if (res === undefined) {
            return undefined;
        }

        return this.#buckets[res.buckIdx][res.localIdx];
    }

    // === Iterator ===

    /**
     * @returns {Iterator}
     */
    [Symbol.iterator]() {
        let idx = 0;
        return {
            next: () => {
                if(idx < this.#size) {
                    return {value: this.at(idx++), done: false};
                } else {
                    return {value: undefined, done: true};
                }
            },
            [Symbol.iterator]() {
                return this;
            }
        }
    }

    // === Internal methods (optional) ===

    /**
     * @param {boolean} [front=false] 
     */
    _ensureBucket(front = false) {
        this.#bucketSize += 2;
        let tmp = new Array(this.#bucketSize);
        let j = 0;
        if(front) {
            for(let i = 0; i < this.#bucketSize; ++i) {
                if(i > 1) {
                    tmp[i] = this.#buckets[j++];
                }
                else {
                    tmp[i] = new Array(this.#everyBucketsLength).fill(undefined);
                }
            }
            this.#buckets = tmp;
            this.#frontBucket = 1;
            this.#backBucket += 2;
        } else {
            for(let i = 0; i < this.#bucketSize; ++i) {
                if(i >= this.#buckets.length) {
                    tmp[i] = new Array(this.#everyBucketsLength).fill(undefined);
                } else {
                    tmp[i] = this.#buckets[j++];
                }
            }
            this.#buckets = tmp;
            this.#backBucket = this.#bucketSize - 2;
        }
    }

    /**
     * @param {number} globalIndex 
     * @returns {{localIdx: number, buckIdx: number}|undefined}
     */
    _bucketIndex(globalIndex) {
        if(this.isEmpty() || globalIndex < 0 || globalIndex >= this.#size) return undefined;
        let absIdx = globalIndex + this.#frontIndex + 1;
        let localIdx = absIdx % this.#everyBucketsLength;
        let buckIdx = this.#frontBucket + Math.floor(absIdx / this.#everyBucketsLength);
        return {localIdx: localIdx, buckIdx: buckIdx};
    }
}
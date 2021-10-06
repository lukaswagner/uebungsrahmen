'use strict';

const readline = require('readline');

class Progress {
    constructor(label, max, width = 10) {
        this.label = label;
        this.value = 0;
        this.max = max;
        this.width = width;
    }

    set(value) {
        this.value = value;
        this.render();
    }

    increase() {
        this.value++;
        this.render();
    }

    render() {
        process.stdout.write('\r');
        process.stdout.write(this.label);
        const num = Math.floor(this.value / this.max * this.width);
        process.stdout.write(` [${'='.repeat(num).padEnd(this.width)}]`);
    }

    done() {
        process.stdout.write('\n');
    }
}

module.exports = Progress;

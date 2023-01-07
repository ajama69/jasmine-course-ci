function Calculator() {
    this.total = 0;
}

Calculator.prototype.add = function(number) {
    return this.total += number;
}

Calculator.prototype.subtract = function(number) {
    return this.total -= number;
}

Calculator.prototype.multiply = function(number) {
    return this.total *= number;
}

Calculator.prototype.divide = function(number) {
    if (number === 0) {
        throw new Error('Cannot divide by zero');
    }

    return this.total /= number;
}

Object.defineProperty(Calculator.prototype, 'version', {
    get: function() {
        let versionUrl1 = 'https://gist.githubusercontent.com/ajama69/78c10fe194e798fb51c5a862361b43cb/raw/7b81c6d562e346b8fb7f5482e96033f5ee0e4cc1/version.json';
        let versionUrl2 = 'https://gist.githubusercontent.com/ajama69/78c10fe194e798fb51c5a862361b43cb/raw/1055d2fd54a9e80ecacb90a67471bd82903b7644/version.json';
        return fetch(versionUrl1)
            .then(function(result) {
                return result.json();
            })
            .then(function(json) {
                return json.version;
            })
    },
    enumerable: true,
    configurable: true
});

function convertToPolish(inputArr) {
    let precedence = {
        "√": 5,
        "^": 5,
        "*": 4,
        "/": 4,
        "%": 3,
        "+": 2,
        "-": 2,
        "(": 1
    };

    let polishList = [];
    let opStack = [];

    for(let val of inputArr) {
        if(typeof val === 'number') {
            polishList.push(val)

        } else if (val === '(') {
            opStack.push(val);

        } else if (val === ')') {
            let next = opStack.pop();
            
            while(next !== '(') {
                polishList.push(next);
                next = opStack.pop();
            }
        } else {
            while(opStack.length > 0 && precedence[opStack[opStack.length - 1]] >= precedence[val]) {
                polishList.push(opStack.pop());
            }

            opStack.push(val);
        }

    }

    while(opStack.length > 0) {
        polishList.push(opStack.pop());
    }

    return polishList;
}

function evaluatePolish(polishList) {
    let evalStack = [];
    let functions = getFunctions();
    let current = 0;

    while(current < polishList.length) {
        if(polishList[current] in functions) {
            let b = evalStack.pop();
            evalStack.push(functions[polishList[current]](evalStack.pop(),b));
        } else {
            evalStack.push(polishList[current]);
        }

        current++;
    }

    return evalStack.pop();
}

function getFunctions() {
    return {
        "√": (a,b) => Math.sqrt(a),
        "^": (a,b) => a ** b,
        "*": (a,b) => a * b,
        "/": (a,b) => a / b,
        "%": (a,b) => a % b,
        "+": (a,b) => a + b,
        "-": (a,b) => a - b
    }
}

class CalculatorInput {
    constructor() {
        this.input = [];
    }

    getLastInput() {
        return this.input[this.input.length - 1];
    }

    getEntryTYpe(val) {
        if(typeof val === 'number') return 'value';
        if(val === '(' || val === ')') return 'paren';
        return 'operator';
    }

    validParenthesis(lastEntryType,val) {
        if(val === ')') {
            if(lastEntryType === 'operator') return false;
            if(this.input.search('(') < 0) return false;
            if(this.getLastInput() === '(') return false;
        }

        return true;
    }

    validEntry(lastEntryType, currEntryType, val) {

        if(this.input.length === 0) {
            return currEntryType === 'value' || val === '(';
        } else if(currEntryType === 'paren') {
            return this.validParenthesis(lastEntryType,currEntryType);
        } else if(lastEntryType === 'value') {
            return currEntryType === 'operator' || currEntryType === 'paren';
        } else if(lastEntryType === 'operator') {
            return currEntryType === 'value' || val === '(';
        } else if(this.getLastInput() === '(') {
            return currEntryType === 'value';
        }

        return true;
    }

    pushInputToStack(val) {
        let lastEntryType = this.getEntryTYpe(this.getLastInput());
        let currEntryType = this.getEntryTYpe(val);

        if(this.validEntry(lastEntryType,currEntryType,val)) {
            if(currEntryType === 'value' && this.getLastInput === ')') {
                this.input.push('*',val);
            } else if (val === '(' && (lastEntryType === 'value' || this.getLastInput === ')')) {
                this.input.push('*',val);
            } else if (val === '√') {
                this.input.push(val,'2');
            } else if(val === '+/-') {
                this.input.push('*','-1');
            }
            
            this.input.push(val);
        }

        return undefined;
    }

    getInput() {
        return this.input;
    }
}

let calcTest = new CalculatorInput();

'4+5+2+(12-2)(13-1)'.split('').forEach((v) => calcTest.pushInputToStack(v));

let validtest = [4,"*",5,"+","(","(",13,"-",3,")","/",5,"+",14,")","√",2];

let polishList = convertToPolish(calcTest.getInput());

console.log(polishList);
console.log(evaluatePolish(polishList));
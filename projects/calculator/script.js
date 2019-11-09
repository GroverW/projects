function convertToPolish(inputArr) {
    let precedence = {
        "log": 6, "ln": 6, 'neg': 6, "√": 5, "^": 5, 
        "*": 4, "/": 4, "%": 3, "+": 2, "-": 2, "(": 1
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
        "log": (a,b) => Math.log10(a * b),
        "ln": (a,b) => Math.log(a * b),
        "neg": (a,b) => -1 * a,
        "√": (a,b) => Math.sqrt(a),
        "^": (a,b) => a ** b,
        "*": (a,b) => a * b,
        "/": (a,b) => a / b,
        "%": (a,b) => a % b,
        "+": (a,b) => a + b,
        "-": (a,b) => a - b,
    }
}

class calculatorInputProcessor {
    constructor(funcFormats) {
        this.inputList = [];
        this.inputBuffer = []
        this.funcFormats = funcFormats;
        this.lastEntryType = '';
        this.currEntryType = '';
    }

    getLastInput() {
        if(this.inputBuffer.length === 0) {
            return this.inputList[this.inputList.length - 1];
        } else {
            return this.inputBuffer[this.inputBuffer.length - 1];
        }
    }

    getEntryType(val) {
        if(typeof val === 'number') return 'value';
        if(val === '(' || val === ')') return 'paren';
        return 'operator';
    }

    validParenType(val) {
        if(val === ')' && this.lastEntryType === 'operator') return false;
        if(val === ')' && this.getLastInput() === '(') return false;
        if(!this.validParens([...this.inputBuffer,val])) return false;

        return true;
    }

    validParens(arr) {
        let parenStack = [];

        for(let val of arr) {
            if(val === '(') parenStack.push(val);
            if(val === ')' && parenStack.length > 0) parenStack.pop();
        }

        return parenStack.length === 0;
    }

    findLeftParen() {
        if(this.getLastInput() === ')') {
            let leftParens = 1, rightParens = 0;

            for(let index = this.inputBuffer.length - 2; index >= 0; index--) {
                if(this.inputBuffer[index] === ')') rightParens++;
                if(this.inputBuffer[index] === '(') leftParens++;
                if(rightParens === leftParens) return index;
            }
        }

        return false;
    }

    validEntryType(val) {
        if(this.inputList.length === 0) {
            return this.currEntryType === 'value' || val === '(';
        } else if(this.currEntryType === 'paren') {
            return this.validParenType(val);
        } else if(this.lastEntryType === 'operator') {
            return this.currEntryType === 'value' || val === '(';
        } else if(this.getLastInput() === '(') {
            return this.currEntryType === 'value';
        }

        return true;
    }

    pushInputToBuffer(val) {
        if(this.lastEntryType === 'value' && this.currEntryType === 'value') {
            this.inputBuffer.push(+''+this.inputBuffer.pop()+val)
        } else if(this.currEntryType === 'value' && this.getLastInput() === ')') {
            this.inputBuffer.push('*',val);
        } else if (val === '(') {
            if(this.lastEntryType === 'value' || this.getLastInput() === ')')
                this.inputBuffer.push('*',val);
        } else if(val === '±') {
            if(this.getLastInput() === ')') {
                this.inputBuffer.splice(this.findLeftParen(),0,...this.funcFormats[val])
            } else {
                this.inputBuffer.push(this.inputBuffer.pop() * -1)
            }
        } else if(val === 'e^') {
            if(this.getLastInput() === ')') {
                this.inputBuffer.splice(this.findLeftParen(),0,...this.funcFormats[val])
            } else {
                this.inputBuffer.push(...this.funcFormats[val],this.inputBuffer.pop())
            }
        } else if(val in this.funcFormats) {
            this.inputBuffer.push(this.funcFormats[val]);
        }
    }

    pushInputToStack(val) {
        if(val === 'π') val = Math.PI;
        if(val === 'clear') this.clearInputBuffer();

        this.getEntryType(this.getLastInput());
        this.getEntryType(val);

        if(this.validEntryType(val)) {
            if(this.inputTypeChange() && this.validParens()) {
                this.inputList.push(...this.inputBuffer);
                this.clearInputBuffer();
            } else {
                this.pushInputToBuffer(val);
            }
        }
    }

    inputTypeChange() {
        return this.lastEntryType !== this.currEntryType;
    }

    getInputList() {
        return this.inputList;
    }

    getInputBuffer() {
        return this.inputBuffer;
    }

    clearInputBuffer() {
        this.inputBuffer.length = 0;
    }
}

let keyPresses = {
    46: 'clear', 13: '=', 187: '=', 107: '+', 109: '-', 106: '*',
    111: '/', 191: '/', 110: '.', 189: '±', 48: 0, 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 53: 5, 101: 5,
    54: 6, 102: 6, 55: 7, 103: 7, 56: 8, 104: 8, 57: 9, 105: 9
};

let keyWithShift = {
    53: '%', 54: '^', 56: '*', 57: '(', 48: ')', 187: '+',
    46: 'clear', 13: '=', 107: '+', 109: '-', 106: '*',
    111: '/', 191: '/', 110: '.', 189: '±', 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 101: 5,
    102: 6,103: 7, 104: 8, 105: 9
}

let funcFormats = {
    '√': ['√',1], '±': 'neg', '^2': ['^',2], 'e^': [Math.exp(),'^'], 'log': ['log','*',1], 'ln': ['ln','*',1],
}

let calcTest = new calculatorInputProcessor(funcFormats);

let form = document.querySelector('#display_form');

form.addEventListener('submit',(event) => {
    event.preventDefault();
})

let calcButttons = document.querySelectorAll('.opButton, .numButton');

calcButttons.forEach((obj) => {
    obj.addEventListener('click',() => console.log(obj.value));
});

addEventListener('keydown',(event) => {
    let keyMap = event.shiftKey ? keyWithShift : keyPresses;

    if(event.which in keyMap) {
        console.log(keyMap[event.which]);
    }
});


let validtest = [4,"*",5,"+","(","(",13,"-",3,")","/",5,"+",14,")","√",2];
for(let val of validtest) {
    calcTest.pushInputToStack(val);
}

console.log(calcTest.getInputList());

/*

'4+5+2+(12-2)(13-1)'.split('').forEach((v) => calcTest.pushInputToStack(v));

let validtest = [4,"*",5,"+","(","(",13,"-",3,")","/",5,"+",14,")","√",2];

let polishList = convertToPolish(calcTest.getInput());

console.log(polishList);
console.log(evaluatePolish(polishList));*/
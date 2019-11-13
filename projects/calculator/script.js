function convertToPolish(inputArr) {
    let precedence = {
        "log": 6, "ln": 6, 'neg': 6, "√": 6, "^": 5, 
        "*": 4, "/": 4, "%": 3, "+": 2, "-": 2, "(": 1
    };

    let polishList = [];
    let opStack = [];

    for(let val of inputArr) {
        if(typeof val === 'number') {
            polishList.push(+val)

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
        if(polishList[current] in functions["oneVar"]) {
            evalStack.push(functions["oneVar"][current](evalStack.pop()));
        } else if(polishList[current] in functions["twoVar"]) {
            let b = evalStack.pop();
            evalStack.push(functions["twoVar"][polishList[current]](evalStack.pop(),b));
        } else {
            evalStack.push(polishList[current]);
        }

        current++;
    }

    return evalStack.pop();
}

function getFunctions() {
    return {
        "oneVar": {
            "log":  (a) => Math.log10(a),
            "ln":   (a) => Math.log(a),
            "neg":  (a) => -a,
            "√":    (a) => Math.sqrt(a),
        },
        "twoVar": {
            "^":    (a,b) => a ** b,
            "*":    (a,b) => a * b,
            "/":    (a,b) => a / b,
            "%":    (a,b) => a % b,
            "+":    (a,b) => a + b,
            "-":    (a,b) => a - b,
        }
    }
}

class calculatorInputProcessor {
    constructor(funcFormats,oneVarOps) {
        this.inputList = [];
        this.inputBuffer = []
        this.funcFormats = funcFormats;
        this.oneVarOps = oneVarOps;
        this.lastInput = false;
        this.currInput = false;
        this.lastInputType = '';
        this.currInputType = '';
    }

    setCurrInput(val) {
        this.currInput = val.toString();
    }

    setLastInput() {
        if(this.inputBuffer.length === 0) {
            if(this.inputList.length === 0) this.lastInput = this.currInput;

            this.lastInput =  this.inputList[this.inputList.length - 1];
        } else {
            this.lastInput =  this.inputBuffer[this.inputBuffer.length - 1];
        }
    }

    getInputTypes(val) {
        if(typeof +val === 'number') return 'value';
        if(val === '(' || val === ')') return 'paren';
        return 'operator';
    }

    setInputTypes() {
        this.lastInputType = this.getInputTypes(this.lastInput);
        this.currInputType = this.getInputTypes(this.currInput);
    }

    validParenType() {
        if(this.currInput === ')' && this.lastInputType === 'operator') return false;
        if(this.currInput === ')' && this.lastInput === '(') return false;
        if(!this.completeParens([...this.inputBuffer,this.currInput])) return false;

        return true;
    }

    completeParens(arr) {
        let parenStack = [];

        for(let val of arr) {
            if(val === '(') parenStack.push(val);
            if(val === ')' && parenStack.length > 0) parenStack.pop();
        }

        return parenStack.length === 0;
    }

    findLeftParen() {
        if(this.lastInput === ')') {
            let leftParens = 1, rightParens = 0;

            for(let index = this.inputBuffer.length - 2; index >= 0; index--) {
                if(this.inputBuffer[index] === ')') rightParens++;
                if(this.inputBuffer[index] === '(') leftParens++;
                if(rightParens === leftParens) return index;
            }
        }

        return false;
    }

    fixParens() {
        let leftParens = 0, rightParens = 0;

        for(let index = 0; index < this.inputBuffer.length; index++) {
            if(this.inputBuffer[index] === ')') rightParens++;
            if(this.inputBuffer[index] === '(') leftParens++;
        }

        for(let numParens = 0; numParens < leftParens - rightParens; numParens++) {
            this.inputBuffer.push(')');
        }
    }

    validEntryType() {
        if(this.inputList.length === 0) {
            return this.currInputType === 'value' || this.currInput === '(';
        } else if(this.currInputType === 'paren') {
            return this.validParenType(this.currInput);
        } else if(this.lastInputType === 'operator') {
            return this.currInputType === 'value' || this.currInput === '(';
        } else if(this.lastInput === '(') {
            return this.currInputType === 'value';
        }

        return true;
    }

    pushInputToBuffer() {
        if(this.lastInputType === 'value' && this.currInputType === 'value') {
            this.inputBuffer.push(this.inputBuffer.pop()+this.currInput);
        } else if(this.currInput === '.') {
            if(this.lastInputType === 'value') {
                if(this.lastInput.indexOf('.') < 0) {
                    this.inputBuffer.push(this.inputBuffer.pop()+this.currInput);
                }
            } else {
                this.inputBuffer.push('0.');
            }
        } else if(this.currInputType === 'value' && this.lastInput === ')') {
            this.inputBuffer.push('*',this.currInput);
        } else if (this.currInput === '(') {
            if(this.lastInputType === 'value' || this.lastInput === ')')
                this.inputBuffer.push('*',this.currInput);
        } else if(this.currInput === '±') {
            if(this.lastInput === ')') {
                this.inputBuffer.splice(this.findLeftParen(),0,...this.funcFormats[this.currInput]);
            } else {
                this.inputBuffer.push(this.inputBuffer.pop() * -1);
            }
        } else if(this.oneVarOps.has(this.currInput)) {
            if(this.lastInput === ')') {
                this.inputBuffer.splice(this.findLeftParen(),0,...this.funcFormats[this.currInput]);
            } else {
                this.inputBuffer.push(...this.funcFormats[this.currInput],'(',this.inputBuffer.pop(),')');
            }
        } else if(this.currInput === '1/') {
            if(this.lastInput === ')') {
                this.inputBuffer.splice(this.findLeftParen(),0,...this.funcFormats[this.currInput]);
                this.inputBuffer.push(')');
            } else {
                this.inputBuffer.push(...this.funcFormats[this.currInput],this.inputBuffer.pop(),')');
            }
        } else if(this.currInput in this.funcFormats) {
            this.inputBuffer.push(this.funcFormats[this.currInput]);
        }
    }

    pushInputToStack(val) {
        this.setCurrInput(val);
        this.setLastInput();

        if(this.currInput === 'π') this.currInput = Math.PI;
        if(this.currInput === 'clear') this.clearInputBuffer();

        this.setInputTypes();

        if(this.validEntryType(this.currInput)) {
            if(this.currInput === '=') {
                if(!this.completeParens()) {
                    this.fixParens();
                }
                this.inputListpush(...this.inputBuffer);
                this.clearInputBuffer();
            }
            if(this.inputTypeChange() && this.completeParens()) {
                this.inputList.push(...this.inputBuffer);
                this.clearInputBuffer();
            } else {
                this.pushInputToBuffer();
            }
        }
    }

    inputTypeChange() {
        return this.lastInputType !== this.currInputType;
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
    '±': 'neg', '^2': ['^',2],'√': ['√','('], 'log': ['log','('], 'ln': ['ln','('], '1/x': ['(','1','/'], 'e^': ['e','^']
}
let oneVarOps = new Set(['√','e^','log'],'ln');

let calcTest = new calculatorInputProcessor(funcFormats,oneVarOps);

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
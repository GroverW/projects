class Calculator {
    constructor() {
        this.polishList = [];
        this.precedence = {
            "log": 6, "ln": 6, 'neg': 6, "√": 6, "^": 5, 
            "*": 4, "/": 4, "%": 3, "+": 2, "-": 2, "(": 1
        };
        this.functions = {
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
        };
    }
    
    convertToPolish(inputArr) {
        let opStack = [];
    
        for(let val of inputArr) {
            if(typeof val === 'number') {
                this.polishList.push(+val)
    
            } else if (val === '(') {
                opStack.push(val);
    
            } else if (val === ')') {
                let next = opStack.pop();
                
                while(next !== '(') {
                    this.polishList.push(next);
                    next = opStack.pop();
                }
            } else {
                while(opStack.length > 0 && this.precedence[opStack[opStack.length - 1]] >= this.precedence[val]) {
                    this.polishList.push(opStack.pop());
                }
    
                opStack.push(val);
            }
    
        }
    
        while(opStack.length > 0) {
            this.polishList.push(opStack.pop());
        }
    
        return this;
    }
    
    evaluatePolish() {
        let evalStack = [];
        let current = 0;
    
        while(current < this.polishList.length) {
            if(this.polishList[current] in this.functions["oneVar"]) {
                evalStack.push(this.functions["oneVar"][current](evalStack.pop()));
            } else if(this.polishList[current] in this.functions["twoVar"]) {
                let b = evalStack.pop();
                evalStack.push(this.functions["twoVar"][this.polishList[current]](evalStack.pop(),b));
            } else {
                evalStack.push(this.polishList[current]);
            }
    
            current++;
        }
    
        return evalStack.pop();
    }
}

class calculatorInputProcessor {
    constructor(funcFormats,oneVarOps) {
        this.inputList = [];
        this.funcFormats = funcFormats;
        this.oneVarOps = oneVarOps;
        this.specialRuleOps = new Set(['±','1/x','del','clear','.']);
        this.lastInput = false;
        this.currInput = false;
        this.displayInput = '0';
        this.lastInputType = '';
        this.currInputType = '';
        this.calculator = new Calculator;
    }

    peakInputList() {
        return this.inputList.length > 0 ? this.inputList[this.inputList.length - 1] : null;
    }

    setCurrInput(val) {
        this.currInput = val.toString();
    }

    setLastInput(val) {
        this.lastInput = val;
    }

    resetDisplayInput() {
        this.displayInput = '0';
    }

    getInputTypes(val) {
        let numCheck = /^-{0,1}\d*\.{0,1}\d+$/;

        if(numCheck.test(val)) return 'value';
        if(val === '(' || val === ')') return 'paren';
        if(val in this.oneVarOps) return 'shortop';
        return 'operator';
    }

    setInputTypes() {
        this.lastInputType = this.getInputTypes(this.lastInput);
        this.currInputType = this.getInputTypes(this.currInput);
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
        let leftParens = 0, rightParens = 0;

        for(let index = this.inputBuffer.length - 1; index >= 0; index--) {
            if(this.inputList[index] === ')') rightParens++;
            if(this.inputList[index] === '(') leftParens++;
            if(leftParens > 0 && leftParens === rightParens) return index;
        }

        return false;
    }

    validRightParen() {
        let leftParens = 0, rightParens = 0;

        for(let val of this.inputList) {
            if(val === ')') rightParens++;
            if(val === '(') leftParens++;
        }

        return leftParens > rightParens;
    }

    fixParens() {
        let leftParens = 0, rightParens = 0;

        for(let index = 0; index < this.inputBuffer.length; index++) {
            if(this.inputList[index] === ')') rightParens++;
            if(this.inputList[index] === '(') leftParens++;
        }

        for(let numParens = 0; numParens < leftParens - rightParens; numParens++) {
            this.inputList.push(')');
        }
    }

    pushSpecialRules() {
        if(this.currInput === '±') {
            if(this.lastInput === ')') {
                this.inputList.splice(this.findLeftParen(),0,...this.funcFormats('±'));

            } else {
                this.displayInput = (-1 * +this.displayInput).toString();
            }
            
            this.displayInput = this.evaluate(this.inputList);

        } else if(this.currInput === '1/x') {
            if(this.lastInput === ')') {
                this.inputList.splice(this.findLeftParen(),0,...this.funcFormats('1/x'),')');
            } else {
                this.inputList.push(...this.funcFormats['1/x'],this.displayInput,')');
            }
        } else if (this.currInput === 'del') {
            if(this.displayInput.length === 1) {
                this.resetDisplayInput();
            } else {
                this.displayInput.length = this.displayInput.length - 1;
            }
        } else if(this.currInput === 'clear') {
            this.resetDisplayInput();
        } else if(this.currInput === '.') {
            if(this.displayInput.indexOf('.') < 0) {
                this.displayInput += '.';
            }
        }
    }

    pushInputToList() {
        if(this.currInput in this.specialRuleOps) {
            this.pushSpecialRules();
        } else if(this.currInputType === 'operator') {
            if(this.lastInputType === 'operator') {
                this.inputList.pop();
                this.inputList.push(this.currInput);

            } else if(this.lastInputType === 'value' || this.lastInput === '(') {
                this.inputList.push(this.displayInput);
                this.displayInput = this.evaluate(this.inputList);

            } else if(this.lastInput === ')') {
                this.inputList.push(this.currInput);
            }

            this.setLastInput(this.currInput);

        } else if(this.currInputType = 'shortop') {
            if(this.peakInputList() === ')') {
                if(this.lastInputType === 'shortop') {
                    this.inputList.splice(this.inputList.lastIndexOf(this.lastInput,this.findLeftParen()),0,...this.funcFormats[this.currInut]);
                    this.inputList.push(')');
                } else {
                    this.inputList.splice(this.findLeftParen(),0,...this.funcFormats[this.currInput]);
                    this.inputList.push(')');
                }

            } else {
                this.inputList.push(...this.funcFormats[this.currInput],this.displayInput,')');
            }

            this.displayInput = this.evaluate(this.inputList);
            this.setLastInput(this.currInput);

        } else if(this.currInputType === 'paren') {
            if(this.currInput === '(') {
                if(this.lastInput === ')' || this.lastInputType === 'value') {
                    this.inputList.push('*',this.currInput);
                } else {
                    this.inputList.push(this.currInput);
                }

            } else if(this.currInput === ')' && this.validRightParen()) {
                if(this.lastInput === '(' || this.lastInputType === 'operator') {
                    this.inputList.push(this.displayInput,this.currInput);
                } else {
                    this.inputList.push(this.currInput);
                }
                
                if(this.completeParens()) {
                    this.displayInput = this.evaluate(this.inputList);
                } else {
                    this.displayInput = this.evaluate(this.inputList.slice(this.findLeftParen()));
                }
            }

            this.setLastInput(this.currInput);

        } else if(this.currInputType === 'value') {
            if(this.displayInput === '0') {
                this.displayInput = this.currInput;
            } else {
                this.displayInput += this.currInput;
            }
        }

        
    }

    getInput(val) {
        if(!this.lastInput) this.setLastInput(val);
        this.setCurrInput(val);

        this.setInputTypes();

        return this;
    }

    getInputList() {
        return this.inputList;
    }

    evaluate() {
        return this.calculator.convertToPolish(this.inputList).evaluatePolish()
    }
}

let keyPresses = {
    8: 'del', 46: 'clear', 13: '=', 187: '=', 107: '+', 109: '-', 106: '*',
    111: '/', 191: '/', 110: '.', 189: '±', 48: 0, 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 53: 5, 101: 5,
    54: 6, 102: 6, 55: 7, 103: 7, 56: 8, 104: 8, 57: 9, 105: 9
};

let keyWithShift = {
    53: '%', 54: '^', 56: '*', 57: '(', 48: ')', 187: '+',
    8: 'del', 46: 'clear', 13: '=', 107: '+', 109: '-', 106: '*',
    111: '/', 191: '/', 110: '.', 189: '±', 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 101: 5,
    102: 6,103: 7, 104: 8, 105: 9
}

let funcFormats = {
    '±': 'neg', '^2': ['^',2],'√': ['√','('], 'log': ['log','('], 'ln': ['ln','('], '1/x': ['(','1','/'], 'e^': [Math.E,'^']
}
let oneVarOps = new Set(['√','neg','log','ln']);

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
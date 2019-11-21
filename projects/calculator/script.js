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
    
    isNum(val) {
        let numCheck = /^-{0,1}\d*\.{0,1}\d+$/;

        return numCheck.test(val);
    }

    resetPolishList() {
        this.polishList.length = 0;
    }

    convertToPolish(inputArr) {
        let opStack = [];
    
        for(let val of inputArr) {
            if(this.isNum(val)) {
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
        
        for(let val of this.polishList) {
            if(val in this.functions["oneVar"]) {
                evalStack.push(this.functions["oneVar"][val](evalStack.pop()));

            } else if(val in this.functions["twoVar"]) {
                let b = evalStack.pop();
                evalStack.push(this.functions["twoVar"][val](evalStack.pop(),b));

            } else {
                evalStack.push(val);
            }
        }

        this.resetPolishList();
    
        return evalStack.pop();
    }
}

class calculatorInputProcessor {
    constructor(funcFormats,oneVarOps,maxMemory = 10) {
        this.inputList = [];
        this.maxMemory = maxMemory;
        this.memory = new Array(0).fill(null).map(() => Object());
        this.funcFormats = funcFormats;
        this.oneVarOps = oneVarOps;
        this.specialRuleOps = new Set(['±','1/x','delete','clear','.','π']);
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

    resetInputList() {
        this.inputList.length = 0;
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

    setDisplayInput(val) {
        this.displayInput = val.toString();
    }

    getInputType(val) {
        let numCheck = /^-{0,1}\d+\.{0,1}\d{0,}$/;

        if(numCheck.test(val)) return 'value';
        if(val === '(' || val === ')') return 'paren';
        if(this.oneVarOps.has(val)) return 'shortop';
        return 'operator';
    }

    setInputTypes() {
        this.lastInputType = this.getInputType(this.lastInput);
        this.currInputType = this.getInputType(this.currInput);
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

        for(let index = this.inputList.length - 1; index >= 0; index--) {
            if(this.inputList[index] === ')') rightParens++;
            if(this.inputList[index] === '(') leftParens++;
            if(leftParens > 0 && rightParens === 0) return index + 1;
            if(leftParens > 0 && leftParens === rightParens) return index;
        }

        return false;
    }

    findLastOp() {
        return this.inputList.lastIndexOf(this.lastInput,this.findLeftParen());
    }

    removeLast(type = '') {
        let start = this.lastInput.length - 1;

        if(type === 'paren') {
            start = this.findLeftParen();

        } else if (type === 'shortop') {
            start = this.findLastOp();

        } else if(type === 'operator') {
            if(this.lastInput in this.funcFormats) {
                start = this.inputList.lastIndexOf(this.funcFormats[this.lastInput][0]);
            } else {
                start = this.inputList.lastIndexOf(this.lastInput);
            }
        }

        let elementsToDelete = this.inputList.length - start;
        this.inputList.splice(start,elementsToDelete);
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
                this.inputList.splice(this.findLeftParen(),0,...this.funcFormats[this.currInput]);

                this.setDisplayInput(this.evaluateCurrent());
                this.setLastInput(this.currInput);

            } else if(this.lastInputType === 'shortop') {
                this.inputList.splice(this.findLastOp(),0,...this.funcFormats[this.currInut],'(');
                this.inputList.push(')');

                this.setDisplayInput(this.evaluateCurrent());
                this.setLastInput(this.currInput);

            } else {
                this.setDisplayInput(-(+this.displayInput));
                this.setLastInput(this.displayInput);
            }

        } else if(this.currInput === '1/x') {
            if(this.lastInput === ')') {
                this.inputList.splice(this.findLeftParen(),0,...this.funcFormats('1/x'));
                this.inputList.push(')');

            } else if(this.lastInputType === 'shortop') {
                this.inputList.splice(this.findLastOp(),0,...this.funcFormats[this.currInut],'(');
                this.inputList.push(')');

            } else {
                this.inputList.push(...this.funcFormats['1/x'],this.displayInput,')');
            }

            this.setDisplayInput(this.evaluateCurrent());
            this.setLastInput(this.peakInputList());

        } else if (this.currInput === 'delete') {
            if(Math.abs(+this.displayInput).toString().length === 1) {
                this.resetDisplayInput();
            } else {
                this.setDisplayInput(this.displayInput.slice(0,this.displayInput.length - 1));
            }

        } else if(this.currInput === 'clear') {
            this.resetInputList();
            this.resetDisplayInput();

        } else if(this.currInput === '.') {
            if(this.displayInput.indexOf('.') < 0) {
                this.setDisplayInput(this.displayInput + '.');
                this.setLastInput(this.displayInput);
            }
        } else if(this.currInput === 'π') {
            this.setDisplayInput(Math.PI);
            this.setLastInput(this.displayInput);
        }
    }

    pushOperatorToList(val) {
        if(val in this.funcFormats) {
            this.inputList.push(...this.funcFormats[val]);
        } else {
            this.inputList.push(val);
        }
    }

    pushInputToList() {
        if(this.specialRuleOps.has(this.currInput)) {
            this.pushSpecialRules();

        } else if(this.currInputType === 'operator') {

            if(this.inputList.length === 0) {
                this.inputList.push(this.displayInput);
                this.pushOperatorToList(this.currInput)

            } else if(this.lastInputType === 'operator') {
                if(this.getInputType(this.peakInputList()) === 'operator') {
                    this.inputList.pop();
                }
                
                this.pushOperatorToList(this.currInput)

            } else if(this.lastInputType === 'value' || this.lastInput === '(') {
                this.inputList.push(this.displayInput);
                this.setDisplayInput(this.evaluateCurrent());
                this.pushOperatorToList(this.currInput)

            } else if(this.peakInputList() === ')') {
                this.pushOperatorToList(this.currInput)
            
            } else if(this.getInputType(this.peakInputList()) === 'value') {
                this.pushOperatorToList(this.currInput);
            }

            this.setLastInput(this.currInput);

        } else if(this.currInputType === 'shortop') {
            if(this.peakInputList() === ')') {
                if(this.lastInputType === 'shortop') {
                    this.inputList.splice(this.findLastOp(),0,...this.funcFormats[this.currInut]);
                    this.inputList.push(')');
                } else {
                    this.inputList.splice(this.findLeftParen(),0,this.currInput);
                }

            } else {
                this.inputList.push(...this.funcFormats[this.currInput],this.displayInput,')');
            }

            this.setDisplayInput(this.evaluateCurrent());
            this.setLastInput(this.currInput);

        } else if(this.currInputType === 'paren') {
            if(this.currInput === '(') {
                if(this.peakInputList() === ')') {
                    this.inputList.push('*');
                }
                
                this.inputList.push(this.currInput);
                this.resetDisplayInput();

                this.setLastInput(this.currInput);

            } else if(this.currInput === ')' && this.validRightParen()) {
                if(this.lastInput === ')') {
                    this.inputList.push(this.currInput);
                } else {
                    this.inputList.push(this.displayInput,this.currInput);
                }
                
                this.setDisplayInput(this.evaluateCurrent());
                this.setLastInput(this.currInput);
            }

        } else if(this.currInputType === 'value') {
            if(this.lastInputType === 'value' || this.lastInput === '.') {
                if(this.displayInput === '0') {
                    this.setDisplayInput(this.currInput);  
                } else {
                    this.setDisplayInput(this.displayInput + this.currInput);
                }

            } else if(this.lastInputType === 'shortop') {
                this.removeLast('shortop');

            } else if(this.lastInputType === 'operator' && this.getInputType(this.peakInputList()) !== 'operator') {
                this.removeLast('operator');
                this.inputList.pop();
                this.setDisplayInput(this.currInput);

            } else {
                if(this.lastInput === ')') {
                    this.removeLast('paren');
                }
                
                this.setDisplayInput(this.currInput);
            }

            this.setLastInput(this.currInput);
        }
    }

    pushToMemory() {
        if(this.memory.length === this.maxMemory) {
            this.memory.pop();
        }

        let memObject = {
            'result': this.displayInput,
            'calc': [...this.inputList]
        }

        this.memory.unshift(memObject);
    }

    getMemory() {
        return this.memory;
    }

    finishProcessing() {
        if(this.peakInputList() === '=') {
            this.inputList.pop();
        }

        if(!this.completeParens(this.inputList)) {
            this.fixParens();
        }

        this.setDisplayInput(this.evaluate(this.inputList));
        
        this.inputList.push('=');

        this.pushToMemory();

        this.resetInputList();
    }

    processInput(val) {
        if(!this.lastInput) this.setLastInput(val);

        this.setCurrInput(val);

        this.setInputTypes();

        this.pushInputToList();

        if(this.currInput === '=') {
            this.finishProcessing();
        }
    }

    getInputList() {
        return this.inputList;
    }

    getDisplayInput() {
        return this.displayInput;
    }

    evaluate(arr) {
        return this.calculator.convertToPolish(arr).evaluatePolish();
    }

    evaluateCurrent() {
        return this.completeParens(this.inputList) ? this.evaluate(this.inputList) : this.evaluate(this.inputList.slice(this.findLeftParen()));
    }
}

let keyPresses = {
    8: 'delete', 46: 'clear', 13: '=', 187: '=', 107: '+', 109: '-', 189: '-',
    106: '*', 111: '/', 191: '/', 110: '.', 190: '.', 48: 0, 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 53: 5, 101: 5,
    54: 6, 102: 6, 55: 7, 103: 7, 56: 8, 104: 8, 57: 9, 105: 9
};

let keyWithShift = {
    53: '%', 54: '^', 56: '*', 57: '(', 48: ')', 187: '+',
    8: 'delete', 46: 'clear', 13: '=', 107: '+', 109: '-', 189: '-',
    106: '*', 111: '/', 191: '/', 110: '.', 190: '.', 96: 0,
    49: 1, 97: 1, 50: 2, 98: 2, 51: 3, 99: 3, 52: 4, 100: 4, 101: 5,
    102: 6,103: 7, 104: 8, 105: 9
}

let funcFormats = {
    '±': ['neg'], '^2': ['^','2'], '√': ['√','('], 'log': ['log','('], 'ln': ['ln','('], '1/x': ['(','1','/'], 'e^': [Math.E,'^']
}
let oneVarOps = new Set(['√','neg','log','ln','±']);
let calcTest = new calculatorInputProcessor(funcFormats,oneVarOps);

let primaryDisplay = document.querySelector('#result');
let secondaryDisplay = document.querySelector('#current_calc');
let historyDisplay = document.querySelector('#history_events');
let calcButttons = document.querySelectorAll('.opButton, .numButton');

function updateHistory(historySelector,calcObj) {
    historySelector.innerText = "";

    let memory = calcObj.getMemory();

    for(let element of memory) {
        let calcElement = document.createElement('div');
        calcElement.setAttribute('class','calc_history');
        calcElement.innerText = element['calc'].join(' ');
        
        let resultElement = document.createElement('div');
        resultElement.setAttribute('class','result_history')
        resultElement.innerText = element['result'];

        historySelector.appendChild(calcElement);
        historySelector.appendChild(resultElement);
    }
}

calcButttons.forEach((obj) => {
    obj.addEventListener('mousedown',(event) => {
        calcTest.processInput(obj.value);
        primaryDisplay.innerText = calcTest.getDisplayInput();

        secondaryDisplay.innerText = calcTest.getInputList().join(' ');

        if(obj.value === '=') {
            updateHistory(historyDisplay,calcTest);
        }
        
    });
});

addEventListener('keydown',(event) => {
    let keyMap = event.shiftKey ? keyWithShift : keyPresses;

    if(event.which in keyMap) {
        calcTest.processInput(keyMap[event.which]);
        
        primaryDisplay.innerText = calcTest.getDisplayInput();
        secondaryDisplay.innerText = calcTest.getInputList().join(' ');
        
        if(keyMap[event.which] === '=') {
            updateHistory(historyDisplay,calcTest);
        }
    }
});



/*let tests = [
    [1,2,'-',4,'.',7,'delete',6,2,'='],
    [2,3,'.',4,5,'-','±',9,'.','.','.',2,3,'='],
    [1,2,'-',3,'^',4,'='],
    [4,"*",5,"+","(","(",1,3,"-",3,")","/",5,"+",14,")","√",'*',2,'='],
    [2,'-','(',1,3,'*',7,')','±','=']
];

for(let test of tests) {
    for(let val of test) {
        calcTest.processInput(val);
    }
}*/
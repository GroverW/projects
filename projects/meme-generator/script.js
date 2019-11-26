let memeForm = document.querySelector('#meme_form');
let memeGrid = document.querySelector('#meme_grid');

let topText = document.querySelector('#top_text');
let bottomText = document.querySelector('#bottom_text');

let memeImage = document.querySelector('#meme_image')
memeImage.addEventListener('change', handleImage,false);

let currMemeNum = 1;
let currMeme = document.querySelector(`#meme${currMemeNum}`);
let memeCanvas = document.querySelector(`#meme${currMemeNum}_canvas`);
let ctx = memeCanvas.getContext('2d');

let img = new Image();
img.crossOrigin='anoynymous';

let memeText = {'top': '', 'bottom': ''};



function drawText(text_val,xOffset = 10, yOffset = 10) {
    ctx.fillStyle = "white";
    ctx.fillText(text_val, xOffset, yOffset);
    
    ctx.lineWidth =  '2';
    ctx.strokeStyle = "black";
    ctx.strokeText(text_val, xOffset, yOffset);
}

function processText(canvasWidth,words,yStart,yChange,combineWords) {
    let maxWidth = canvasWidth - 20;
    let line = '';
    let yOffset = yStart;
    
    for(let word of words) {
        let tempLine = combineWords(line,word);

        let textWidth = ctx.measureText(tempLine.trim()).width;

        if(textWidth > maxWidth) {
            drawText(line.trim(),canvasWidth / 2, yOffset);
            yOffset += yChange;
            line = combineWords('',word);
        } else {
            line = tempLine;
        }
    }

    drawText(line.trim(), canvasWidth / 2, yOffset)
}

function drawLines(text_val,canvasWidth,canvasHeight) {
    let fontRatio = 50 / 450;
    let fontSize = Math.ceil(canvasWidth * fontRatio);
    let lineHeight = fontSize + 10;

    ctx.miterLimit = 2;
    ctx.textBaseLine = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px 'Impact'`;

    let topWords = text_val.top.split(' ')
    processText(canvasWidth,topWords,fontSize,lineHeight,(line,word) => line + word + ' ');
    
    let bottomWords = text_val.bottom.split(' ').reverse();
    processText(canvasWidth,bottomWords,canvasHeight - 10,-lineHeight,(line,word) => ' ' + word + line);
}

function dynamicText(img) {
    topText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0);
        
        memeText.top = topText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
    });

    bottomText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0);
        
        memeText.bottom = bottomText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
    });
}

function handleImage(e) {
    let reader = new FileReader();
    let img = "";
    let src = "";
    
    reader.onload = function(event) {
        img = new Image();
        img.onload = function() {
            memeCanvas.width = img.width;
            memeCanvas.height = img.height;
            ctx.drawImage(img,0,0);
            currMeme.style.width = `${img.width}px`;
            currMeme.style.height =`${img.height}px`;
        }
        img.src = event.target.result;
        src = event.target.result;
        ctx.drawImage(img,0,0);
        dynamicText(img);
    }

    reader.readAsDataURL(e.target.files[0]); 
}

memeForm.addEventListener('submit',(event) => {
    event.preventDefault();
    memeForm.reset();

    let memeDelButton = document.createElement('a');
    memeDelButton.id = `del_meme${currMemeNum}`;
    memeDelButton.classList.add('delete');
    memeDelButton.setAttribute('href','#');

    memeDelButton.addEventListener('click',() => memeDelButton.parentNode.remove());

    currMeme.appendChild(memeDelButton);


    currMemeNum++;
    let nextMeme = document.createElement('div');
    nextMeme.id = `meme${currMemeNum}`;
    nextMeme.classList.add('meme');
    
    let nextMemeCanvas = document.createElement('canvas');
    nextMemeCanvas.id = `meme${currMemeNum}_canvas`;
    nextMeme.appendChild(nextMemeCanvas);

    memeGrid.prepend(nextMeme);

    currMeme = document.querySelector(`#meme${currMemeNum}`);
    memeCanvas = document.querySelector(`#meme${currMemeNum}_canvas`);
    ctx = memeCanvas.getContext('2d');

});

console.log(memeGrid);

/*
function DrawOverlay(img) {
    ctx.drawImage(img,0,0);
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);
}
function DrawText() {
    ctx.fillStyle = "white";
    ctx.textBaseline = 'middle';
    ctx.font = "50px 'Impact'";
    ctx.fillText(text_title, 50, 50);
}
function DynamicText(img) {
    document.getElementById('top_text').addEventListener('keyup', function() {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        DrawOverlay(img);
        DrawText(); 
        text_title = this.value;
        ctx.fillText(text_title, 50, 50);
    });
}
function handleImage(e) {
    let reader = new FileReader();
    let img = "";
    let src = "";
    
    reader.onload = function(event) {
        img = new Image();
        img.onload = function() {
            memeCanvas.width = img.width;
            memeCanvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
        src = event.target.result;
        memeCanvas.classList.add("show");
        DrawOverlay(img);
        DrawText(); 
        DynamicText(img);   
    }

    reader.readAsDataURL(e.target.files[0]); 
}

function convertToImage() {
	window.open(memeCanvas.toDataURL('png'));
}*/
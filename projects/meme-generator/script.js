let memeForm = document.querySelector('#meme_form');
let memeGrid = document.querySelector('#meme_grid');

let topText = document.querySelector('#top_text');
let bottomText = document.querySelector('#bottom_text');

/*let memeImageUpload = document.querySelector('#meme_image_upload')
memeImageUpload.addEventListener('change', handleImage, false);*/

let memeImageLink = document.querySelector('#meme_image_link');
memeImageLink.addEventListener('input', handleImage, false);

let currMemeNum = 1;
let currMeme = document.querySelector(`#meme${currMemeNum}`);
let memeCanvas = document.querySelector(`#meme${currMemeNum}_canvas`);
let ctx = memeCanvas.getContext('2d');

let img = new Image();
img.crossOrigin = 'anoynymous';

let memeText = {'top': '', 'bottom': ''};

let isMemeReady = false;

let addBtnStyle = document.querySelector('#add_btn');


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

function dynamicText(img,scaledWidth,scaledHeight) {
    topText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0,img.width,img.height,0,0,scaledWidth,scaledHeight);
        
        memeText.top = topText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
    });

    bottomText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0,img.width,img.height,0,0,scaledWidth,scaledHeight);
        
        memeText.bottom = bottomText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
    });
}

function handleImage(e) {
    let img = new Image();

    img.onload = function() {
        let scaleFactor = img.width > 660 ? 660 / img.width : 1;
        let scaledWidth = img.width * scaleFactor, scaledHeight = img.height * scaleFactor;

        memeCanvas.width = scaledWidth;
        memeCanvas.height = scaledHeight;

        ctx.drawImage(img,0,0,img.width,img.height,0,0,scaledWidth,scaledHeight);
        
        currMeme.style.width = `${scaledWidth}px`;
        currMeme.style.height =`${scaledHeight}px`;

        dynamicText(img,scaledWidth,scaledHeight);

        if(img.src.split('/').pop() !== "error.png") {
            isMemeReady = true;
            addBtnStyle.classList.add('active');
        }
        
    }

    img.onerror = function() {
        img.src = "images/error.png"
        isMemeReady = false;
        addBtnStyle.classList.remove('active');
    }

    img.src = memeImageLink.value;
    
}

memeForm.addEventListener('submit',(event) => {
    event.preventDefault();
    
    if(isMemeReady) {
        memeForm.reset();

        let memeDelButton = document.createElement('a');
        memeDelButton.id = `del_meme${currMemeNum}`;
        memeDelButton.classList.add('delete');

        memeDelButton.addEventListener('click',(event) => memeDelButton.parentNode.remove());

        currMeme.appendChild(memeDelButton);

        currMemeNum++;
        let nextMeme = document.createElement('div');
        nextMeme.id = `meme${currMemeNum}`;
        nextMeme.classList.add('meme', 'first');
        
        let nextMemeCanvas = document.createElement('canvas');
        nextMemeCanvas.id = `meme${currMemeNum}_canvas`;
        nextMeme.appendChild(nextMemeCanvas);

        memeGrid.prepend(nextMeme);

        currMeme = document.querySelector(`#meme${currMemeNum}`);
        memeCanvas = document.querySelector(`#meme${currMemeNum}_canvas`);
        ctx = memeCanvas.getContext('2d');

        isMemeReady = false;
        addBtnStyle.classList.remove('active');
    }
    

});

/*
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
*/
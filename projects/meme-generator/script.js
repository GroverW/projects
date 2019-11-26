let memeForm = document.querySelector('#meme_form');
let memeGrid = document.querySelector('#meme_grid');
let memeImage = document.querySelector('#meme_image')
let topText = document.querySelector('#top_text');
let bottomText = document.querySelector('#bottom_text');
memeImage.addEventListener('change', handleImage,false);

let currMeme = 1;
let memeCanvas = document.querySelector(`#meme${currMeme}_canvas`);
let ctx = memeCanvas.getContext('2d');

let img = new Image();
img.crossOrigin='anoynymous';

let memeText = {'top': '', 'bottom': ''};

function drawLines(text_val,canvasWidth,canvasHeight) {
    let topWords = text_val.top.split(' ')
    let bottomWords = text_val.bottom.split(' ').reverse();
    console.log(topWords,bottomWords);
    let line = '';
    let maxWidth = canvasWidth - 20;
    let fontRatio = 50 / 450;
    let fontSize = Math.ceil(canvasWidth * fontRatio);
    let yOffset = fontSize;
    let lineHeight = fontSize + 10;

    ctx.miterLimit = 2;
    ctx.textBaseLine = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px 'Impact'`;

    for(let word of topWords) {
        let tempLine = line + word + ' ';
        
        let textWidth = ctx.measureText(tempLine.trim()).width;
        
        if(textWidth > maxWidth) {
            drawText(line.trim(), canvasWidth / 2, yOffset)
            yOffset += lineHeight;
            line = word + ' ';
        } else {
            line = tempLine;
        }
    }

    drawText(line.trim(), canvasWidth / 2, yOffset)

    yOffset = canvasHeight - 10;
    line = '';

    for(let word of bottomWords) {
        let tempLine = ' ' + word + line;

        let textWidth = ctx.measureText(tempLine.trim()).width;

        if(textWidth > maxWidth) {
            drawText(line.trim(),canvasWidth / 2, yOffset);
            yOffset -= lineHeight;
            line = ' ' + word;
        } else {
            line = tempLine;
        }
    }

    drawText(line.trim(), canvasWidth / 2, yOffset)
}

function drawText(text_val,xOffset = 10, yOffset = 10) {
    ctx.fillStyle = "white";
    ctx.fillText(text_val, xOffset, yOffset);
    
    ctx.lineWidth =  '2';
    ctx.strokeStyle = "black";
    ctx.strokeText(text_val, xOffset, yOffset);
}

function dynamicText(img) {
    topText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0);
        
        memeText.top = topText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
        console.log(memeText);
    });

    bottomText.addEventListener('input', () => {
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img,0,0);
        
        memeText.bottom = bottomText.value.toUpperCase();
        
        drawLines(memeText,memeCanvas.width,memeCanvas.height)
        console.log(memeText);
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
        ctx.drawImage(img,0,0);
        dynamicText(img);
    }

    reader.readAsDataURL(e.target.files[0]); 
}

memeForm.addEventListener('submit',(event) => {
    event.preventDefault();

    memeImage.value = "";
    topText.value = "";

    currMeme++;
    let nextMeme = document.createElement('div');
    nextMeme.id = `meme${currMeme}`;
    nextMeme.classList.add('meme');
    
    let nextMemeCanvas = document.createElement('canvas');
    nextMemeCanvas.id = `meme${currMeme}_canvas`;
    nextMeme.appendChild(nextMemeCanvas);

    let nextMemeControls = document.createElement('div');
    nextMemeControls.classList.add('controls');
    
    let nextMemeDownload = document.createElement('a');
    nextMemeDownload.id = `dl_meme${currMeme}`;
    nextMemeDownload.classList.add('download');
    nextMemeDownload.setAttribute('href','#');
    nextMemeDownload.innerText = 'D';

    nextMemeControls.appendChild(nextMemeDownload);

    let nextMemeDelete = document.createElement('a');
    nextMemeDelete.id = `del_meme${currMeme}`;
    nextMemeDelete.classList.add('delete');
    nextMemeDelete.setAttribute('href','#');
    nextMemeDelete.innerText = 'X';

    nextMemeControls.appendChild(nextMemeDelete);

    nextMeme.appendChild(nextMemeControls);

    memeGrid.prepend(nextMeme);

    memeCanvas = document.querySelector(`#meme${currMeme}_canvas`);
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
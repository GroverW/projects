let projectList = [
    {folder: 'memory-game', image: 'memory_image.png', caption: 'Memory Game'},
    {folder: 'bookshelf', image: 'book_image.png', caption: 'Bookshelf'},
    {folder: 'meme-generator', image: 'meme_image.png', caption: 'Meme Generator'},
    {folder: 'calculator', image: 'calc_image.png', caption: 'Calculator'},
    {folder: 'etch-a-sketch', image: 'sketch_image.png', caption: 'Etch-A-Sketch'},
    {folder: 'rock-paper-scissors', image: 'rpc_image.png', caption: 'Rock-Paper-Scissors'}
]

let ProjectThumbNail = function(imageFolder,imageName,captionName) {
    this.imageFolder = imageFolder;
    this.imageName = imageName;
    this.captionName = captionName;
}

ProjectThumbNail.prototype.addToProjects = function(selector) {
    let projectLink = document.createElement('a');
    projectLink.href = `${this.imageFolder}/index.html`;
    projectLink.classList.add('project_link');

    let projectFigure = document.createElement('figure');

    let projectImg = document.createElement('img');
    projectImg.src = `images/${this.imageName}`;
    projectImg.classList.add('thumb_image');

    let projectCaption = document.createElement('figcaption');
    projectCaption.innerText = this.captionName;

    projectFigure.appendChild(projectImg);
    projectFigure.appendChild(projectCaption);

    projectLink.appendChild(projectFigure);

    selector.appendChild(projectLink);
}

let gridCols = document.querySelectorAll('.grid_col');
let numCols = gridCols.length;
let currCol = 0;

for(let project of projectList) {
    let projectThumbNail = new ProjectThumbNail(project.folder,project.image,project.caption);
    
    projectThumbNail.addToProjects(gridCols[currCol]);
    
    currCol = (currCol + 1) % numCols;
}
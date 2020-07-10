let projectList = [
    { link: 'https://test-driven-tetris.herokuapp.com', image: 'tetris_image.png', caption: 'Test-Driven-Tetris' },
    { link: 'https://r14-warbler.herokuapp.com', image: 'warbler_image.png', caption: 'Warbler' },
    { link: 'https://r14-jobly-frontend.herokuapp.com', image: 'jobly_image.png', caption: 'Jobly' },
    { folder: 'memory-game', image: 'memory_image.png', caption: 'Memory Game' },
    { folder: 'bookshelf', image: 'book_image.png', caption: 'Bookshelf' },
    { folder: 'meme-generator', image: 'meme_image.png', caption: 'Meme Generator' },
    { folder: 'calculator', image: 'calc_image.png', caption: 'Calculator' },
    { folder: 'etch-a-sketch', image: 'sketch_image.png', caption: 'Etch-A-Sketch' },
    { folder: 'rock-paper-scissors', image: 'rpc_image.png', caption: 'Rock-Paper-Scissors' }
]

let ProjectThumbNail = function ({ folder, link, image, caption }) {
    this.href = folder ? `${folder}/index.html` : link;
    this.src = `images/${image}`;
    this.caption = caption;
}

ProjectThumbNail.prototype.addToProjects = function (selector) {
    let thumbnail = document.createElement('a');

    thumbnail.href = this.href;
    thumbnail.classList.add('project_link');

    let figure = document.createElement('figure');

    let image = document.createElement('img');
    image.src = this.src;
    image.classList.add('thumb_image');

    let caption = document.createElement('figcaption');
    caption.innerText = this.caption;

    figure.appendChild(image);
    figure.appendChild(caption);

    thumbnail.appendChild(figure);

    selector.appendChild(thumbnail);
}

let gridCols = document.querySelectorAll('.grid_col');
const numCols = gridCols.length;
let currCol = 0;

for (let project of projectList) {
    let projectThumbNail = new ProjectThumbNail(project);

    projectThumbNail.addToProjects(gridCols[currCol]);

    currCol = (currCol + 1) % numCols;
}
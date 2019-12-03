var Book = function(title,author,numPages,isRead,summary,rating) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead;
    this.summary = summary;
    this.rating = rating;
}

const SHELVES = 2;
const STACKS_PER_SHELF = 3;
const BOOKS_PER_STACK = 4;

let bookShelf = new Array(SHELVES).fill(null)
                    .map((v) => Array(STACKS_PER_SHELF).fill(null)
                    .map((v) => Array(0)));

let stacks = document.querySelectorAll('.shelf_stack');

stacks.forEach((shelf) => {
    shelf.addEventListener('click',() => {
        let coords = shelf.id.split('_');

        console.log(coords[0],coords[1]);
    });
});

let books = document.querySelectorAll('.book1, .book2, .book3, .book4');

books.forEach((book) => {
    book.addEventListener('click',(event) => {
        event.stopPropagation();
        console.log('book!');
    });
});

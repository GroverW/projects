var Book = function(title,author,numPages,isRead,summary,rating) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead;
    this.summary = summary;
    this.rating = rating;
}

const BOOK_STACKS = 6;
const BOOKS_PER_STACK = 4;

let bookShelf = new Array(BOOK_STACKS).fill(null).map((v) => Array(0));

let stacks = document.querySelectorAll('.shelf_stack');
stacks.forEach((shelf) => {
    shelf.addEventListener('click',() => {
        console.log(shelf.id);
    });
});

let editForm = document.querySelector('#edit_form');

let books = document.querySelectorAll('.book1, .book2, .book3, .book4');

books.forEach((book) => {
    book.addEventListener('click',(event) => {
        event.stopPropagation();
        editForm.classList.add('show');
        console.log('book!');
    });
});

let selectedBook = document.querySelector('#selected');

selectedBook.value = 'hellu';
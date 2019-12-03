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
let selectedElement = document.querySelector('#selected');
let editForm = document.querySelector('#edit_form');
let editFormTitle = document.querySelector('#edit_form_title');
let bookTitle = document.querySelector('#book_title');
let bookAuthor = document.querySelector('#book_author');
let bookPages = document.querySelector('#book_pages');
let bookSummary = document.querySelector('#book_summary');
let hasRead = document.querySelector('#has_read');


let cancelButton = document.querySelector('#cancel');
cancelButton.addEventListener('click',() => {
    editForm.classList.remove('show');
});

let stacks = document.querySelectorAll('.shelf_stack');
stacks.forEach((stack) => {
    stack.addEventListener('click',() => {
        editForm.reset();
        selectedElement.value = 's.' + stack.id;
        editFormTitle.innerText = 'New Book';
        editForm.classList.add('show');
    });
});

let books = document.querySelectorAll('.book1, .book2, .book3, .book4');
books.forEach((book) => {
    book.addEventListener('click',(event) => {
        event.stopPropagation();
        editFormTitle.innerText = 'Update Book';
        selectedElement.value = 'b.' + book.id;
        editForm.classList.add('show');
    });
});

editForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let action = selectedElement.value.split('.');
    if(action.length > 0) {
        if(action[0] === 's') {
            bookShelf[+action[1]] = new Book(bookTitle.value,
                                            bookAuthor.value,
                                            bookPages.value,
                                            hasRead.value,
                                            bookSummary.value,
                                            5);
        }
    }

});


const BOOK_STACKS = 6;
const BOOKS_PER_STACK = 4;

let bookShelf = new Array(BOOK_STACKS).fill(null).map((v) => Array(0));

class BookTitle extends HTMLElement {
    constructor() {
        super();
    }
}

class BookAuthor extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('book-title',BookTitle);
customElements.define('book-author',BookAuthor);

var Book = function(title,author,numPages,isRead,summary,rating) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasRead = isRead;
    this.summary = summary;
    this.rating = rating;
}

var createRandomNum = function(min,max) {
    return Math.random() * (max - min) + min;
}

var randomizeBookType = function(types,weights) {
    let totalWeight = weights.reduce((sum,currVal) => sum += currVal,0);
    let weightSum = 0;
    let randomNum = createRandomNum(0,totalWeight);

    for(let i = 0; i < weights.length; i++) {
        weightSum += +weights[i].toFixed(2);

        if(randomNum <= weightSum) {
            return types[i];
        }
    }
}

var addBookToShelf = function(book,stackID) {
    if(bookShelf[stackID].length === BOOKS_PER_STACK) {
        console.log('Stack is full!');
    } else {
        let bookType = randomizeBookType([1,2,3,4],[.15,.15,.35,.35]);

        let newBook = document.createElement('div');
        newBook.id = 'b-' + stackID + '_' + bookShelf[stackID].length;
        newBook.classList.add(`book${bookType}`);

        let newBookTitle = document.createElement('book-title');
        console.log(newBook.title);
        newBookTitle.innerText = book.title;

        let newBookAuthor = document.createElement('book-author');
        console.log(newBook.author);
        newBookAuthor.innerText = book.author;

        newBook.appendChild(newBookTitle);
        newBook.appendChild(newBookAuthor);

        let stack = document.querySelector(`#s-${stackID}`);
        stack.prepend(newBook);
    }
}


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
        selectedElement.value = stack.id;
        editFormTitle.innerText = 'New Book';
        editForm.classList.add('show');
    });
});

console.log(stacks);

let books = document.querySelectorAll('.book1, .book2, .book3, .book4');
books.forEach((book) => {
    book.addEventListener('click',(event) => {
        event.stopPropagation();
        editFormTitle.innerText = 'Update Book';
        selectedElement.value = book.id;
        editForm.classList.add('show');
    });
});

editForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let instructions = selectedElement.value.split('-');
    
    if(instructions.length > 0) {
        let action = instructions[0];
        let actionID = instructions[1];

        if(action === 's') {
            let newBook = new Book(bookTitle.value,
                                bookAuthor.value,
                                bookPages.value,
                                hasRead.value,
                                bookSummary.value,
                                5);

            addBookToShelf(newBook,+actionID)

            editForm.reset();
            editForm.classList.remove('show');
        } else if(action === 'b') {
            let bookLocation = actionID.split('_');
            let shelfID = bookLocation[0];
            let bookID = bookLocation[1];

            bookShelf[shelfID][bookID].title = bookTitle.value;
            bookShelf[shelfID][bookID].author = bookAuthor.value;
            bookShelf[shelfID][bookID].numPages = bookPages.value;
            bookShelf[shelfID][bookID].hasRead = hasRead.value;
            bookShelf[shelfID][bookID].summary = bookSummary.value;
        }
    }

});


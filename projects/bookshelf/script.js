const BOOK_STACKS = 6;
const BOOKS_PER_STACK = 4;

let bookShelf = new Array(BOOK_STACKS).fill(null).map((v) => Array(0));

var Book = function(title,author,numPages,isRead,summary,rating) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead;
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

var addBookToShelf = function(book,shelfID) {
    if(bookShelf[shelfID].length === BOOKS_PER_STACK) {
        console.log('Stack is full!');
    } else {
        let bookType = randomizeBookType([1,2,3,4],[.15,.15,.35,.35]); 
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
        selectedElement.value = 's.' + stack.id;
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
        selectedElement.value = 'b.' + book.id;
        editForm.classList.add('show');
    });
});

editForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let instructions = selectedElement.value.split('.');
    
    if(instructions.length > 0) {
        let action = instructions[0];
        let actionID = instructions[1];

        if(action[0] === 's') {
            let book = new Book(bookTitle.value,
                                bookAuthor.value,
                                bookPages.value,
                                hasRead.value,
                                bookSummary.value,
                                5);

            addBookToShelf(book,+actionID)
        }
    }

});


const snakeObjectTest = require('../snakeObject');

test('Set Default Snake',() => {
    let expectedSnake = [
        [0,0],
        [0,1],
        [0,2]
    ]
    
    expect(snakeObjectTest.getSnake()).toEqual(expectedSnake);
});

test('Move Snake Down',() => {
    let expectedSnake = [
        [0,1],
        [0,2],
        [0,3]
    ]
    
    snakeObjectTest.moveSnake([0,1]);

    expect(snakeObjectTest.getSnake()).toEqual(expectedSnake);
});
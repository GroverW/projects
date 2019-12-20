const tests = require('../index');

test('Set Default Snake',() => {
    expect(tests.snakeObject.getSnake()).toEqual([
        [0,0],
        [0,1],
        [0,2]
    ]);
});

test('Move Snake Down',() => {
    tests.snakeObject.moveSnake([0,1]);

    expect(tests.snakeObject.getSnake()).toEqual([
        [0,1],
        [0,2],
        [0,3]
    ]);
});
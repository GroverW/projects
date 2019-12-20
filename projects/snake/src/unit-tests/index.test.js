const tests = require('../index');

// Test Snake Object
test('Set Default Snake',() => {
    let snakeResult = [];
    tests.pubSub.subscribe('getSnake',(data) => snakeResult = data);

    tests.Snake.getSnake();

    expect(snakeResult).toEqual(tests.defaultSnake);
});

test('Move Snake Down',() => {
    let snakeResult = [];
    let expectedSnake = tests.defaultSnake.map(v => [v[0],v[1]+1]);
    
    tests.pubSub.subscribe('getSnake',(data) => snakeResult = data);

    tests.Snake.moveSnake([0,1]);

    expect(snakeResult).toEqual(expectedSnake);
});

// Test Game Object
const tests = require('../index');

// Test Snake Object
test('Set Default Snake',() => {
    let snakeResult = [];
    tests.PubSub.subscribe('getSnake',(data) => snakeResult = data);

    tests.Snake.getSnake();

    expect(snakeResult).toEqual(tests.defaultSnake);
});

test('Move Snake Down',() => {
    let snakeResult = [];
    let expectedSnake = tests.defaultSnake.map(v => [v[0],v[1]+1]);

    tests.PubSub.subscribe('getSnake',(data) => snakeResult = data);

    tests.Snake.moveSnake([0,1]);

    expect(snakeResult).toEqual(expectedSnake);
});

// Test Game Object
test('Game Start',() => {
    let gameState = false;

    tests.PubSub.subscribe('gameState',(data) => gameState = data);

    tests.Game.start();

    expect(gameState).toBe(true);
});

test('Game Stop',() => {
    let gameState = true;

    tests.PubSub.subscribe('gameState',(data) => gameState = data);

    tests.Game.stop();

    expect(gameState).toBe(false);
});
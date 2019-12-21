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

test('Game Over - Out of Bounds',() => {
    let gameOver = false;

    tests.PubSub.subscribe('gameOver',(data) => gameOver = data);

    tests.Snake.moveSnake([-100,-100]);

    expect(gameOver).toBe(true);
});

test('Game Not Over',() => {
    let gameOver = false;

    tests.PubSub.subscribe('gameOver',(data) => gameOver = data);

    expect(gameOver).toBe(false);
});

test('Game Over - Ran Into Self',() => {
    let gameOver = false;
    let snakeTest = [];

    tests.PubSub.subscribe('getSnake',(snake) => snakeTest = snake);
    tests.PubSub.subscribe('gameOver',(data) => gameOver = data);
    
    tests.Snake.getSnake();

    let snakeNeck = snakeTest[snakeTest.length - 2], snakeHead = snakeTest[snakeTest.length - 1];
    let moveDirection = [snakeHead[0] - snakeNeck[0],snakeHead[1] - snakeNeck[1]];

    tests.Snake.moveSnake(moveDirection);

    expect(gameOver).toBe(true);
});
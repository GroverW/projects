const PubSub = require('./PubSub');
const defaultSnake = [
    [0,0],
    [0,1],
    [0,2]
];


const Snake = (initialSnake) => {
    let snake = initialSnake;
    let head = snake[snake.length - 1];

    const getSnake = () => PubSub.publish('getSnake',snake);

    const updateHead = () => head = snake[snake.length - 1];

    const moveSnake = (direction) => {
        snake.shift();
        snake.push([
            head[0] + direction[0],
            head[1] + direction[1]
        ]);

        getSnake();
        updateHead();
    }

    return { getSnake, moveSnake };
}

module.exports = {
    defaultSnake,
    Snake: Snake(defaultSnake),
    pubSub: PubSub
};
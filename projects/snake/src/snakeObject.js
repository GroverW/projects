const snakeObject = () => {
    let snake = [
        [0,0],
        [0,1],
        [0,2]
    ];
    let head = snake[snake.length - 1];

    const getSnake = () => snake;

    const updateHead = () => head = snake[snake.length - 1];

    const moveSnake = (direction) => {
        snake.shift();
        snake.push([
            head[0] + direction[0],
            head[1] + direction[1]
        ]);

        updateHead();
    }

    return { getSnake, moveSnake };
}

module.exports = snakeObject();
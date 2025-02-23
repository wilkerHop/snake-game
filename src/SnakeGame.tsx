import { useEffect, useRef, useState } from 'react';

const box = 32;
const canvasWidth = 608;
const canvasHeight = 608;

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState([{ x: 9 * box, y: 10 * box }]);
  const [food, setFood] = useState({
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  });
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const gameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && direction !== 'RIGHT')
        setDirection('LEFT');
      if (event.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (event.key === 'ArrowRight' && direction !== 'LEFT')
        setDirection('RIGHT');
      if (event.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameIntervalRef.current = setInterval(draw, 100);
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? 'green' : 'white';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
      setScore(score + 1);
      setFood({
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box,
      });
    } else {
      snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (
      snakeX < 0 ||
      snakeX >= canvasWidth ||
      snakeY < 0 ||
      snakeY >= canvasHeight ||
      collision(newHead, snake)
    ) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }

    setSnake([newHead, ...snake]);
  };

  const collision = (
    head: { x: number; y: number },
    array: { x: number; y: number }[]
  ) => {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
      <div>Score: {score}</div>
    </div>
  );
}

export default SnakeGame;

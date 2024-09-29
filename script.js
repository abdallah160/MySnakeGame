const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // حجم المربع الواحد
const canvasSize = 400; // حجم لوحة اللعبة

// تحميل الصور والأصوات
const snakeHeadImg = new Image();
snakeHeadImg.src = "snake_head.png";
snakeHeadImg.onerror = () => console.error("Error loading snake head image");

const appleImg = new Image();
appleImg.src = "apple.png";
appleImg.onerror = () => console.error("Error loading apple image");

const eatSound = document.getElementById("eatSound");
const collisionSound = document.getElementById("collisionSound");
const backgroundMusic = document.getElementById("backgroundMusic");

let snake = [{ x: 8 * box, y: 8 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};
let score = 0;

let game = setInterval(drawGame, 150);

// تشغيل موسيقى الخلفية
backgroundMusic.volume = 0.06; // خفض الصوت إلى 30%
backgroundMusic.play().catch(err => console.log("Error playing background music:", err));

// التحكم في حركة الأفعى
document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function drawGame() {
    // رسم خلفية اللعبة
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // رسم الأفعى
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // رسم رأس الأفعى مع الدوران حسب الاتجاه
            drawRotatedHead(snake[i].x, snake[i].y, direction);
        } else {
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }

    // رسم التفاحة
    ctx.drawImage(appleImg, food.x, food.y, box, box);

    // تحريك الأفعى
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;

    // إذا أكلت الأفعى الطعام
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eatSound.play().catch(err => console.log("Error playing eat sound:", err));  // تشغيل صوت الأكل
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
    } else {
        snake.pop();
    }

    // إضافة رأس جديد للأفعى
    const newHead = { x: snakeX, y: snakeY };

    // نهاية اللعبة إذا اصطدمت الأفعى بالجدران أو بجسدها
    if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        collisionSound.play().catch(err => console.log("Error playing collision sound:", err));  // تشغيل صوت الاصطدام
        gameOver();
    }

    snake.unshift(newHead);

    // عرض النتيجة
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// رسم رأس الأفعى مع الدوران
function drawRotatedHead(x, y, direction) {
    const headSize = box * 2;  // مضاعفة حجم الرأس
    ctx.save();  // حفظ حالة الرسم الحالية

    // نقل النقطة المرجعية إلى وسط الرأس
    ctx.translate(x + box / 2, y + box / 2);

    // تحديد الزاوية بناءً على الاتجاه
    let angle = 0;
    if (direction === "UP") {
        angle = -Math.PI / 2;
    } else if (direction === "DOWN") {
        angle = Math.PI / 2;
    } else if (direction === "LEFT") {
        angle = Math.PI;
    } else if (direction === "RIGHT") {
        angle = 0;
    }

    // تدوير الصورة
    ctx.rotate(angle);

    // رسم الرأس بعد التدوير
    ctx.drawImage(snakeHeadImg, -headSize / 2, -headSize / 2, headSize, headSize);

    ctx.restore();  // استعادة حالة الرسم الأصلية
}

// دالة إنهاء اللعبة
function gameOver() {
    document.getElementById("restartButton").style.display = "block";
    alert("Game Over. Your score is: " + score);
}

// دالة إعادة تشغيل اللعبة
function restartGame() {
    snake = [{ x: 8 * box, y: 8 * box }];
    direction = "RIGHT";
    score = 0;
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    document.getElementById("restartButton").style.display = "none";
    game = setInterval(drawGame, 150);
    backgroundMusic.play().catch(err => console.log("Error playing background music:", err));  // إعادة تشغيل موسيقى الخلفية
}

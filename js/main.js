// 游戏数据 - 单词和图片对
// 注意：确保图片路径正确，所有图片文件都存在于images目录中
// 检查图片扩展名是否正确（.png vs .jpg）
// 在index.html中，图片路径是相对于HTML文件的位置
const wordData = [
    { word: 'apple', image: 'images/apple.png', hint: '一种常见的水果，通常是红色或绿色的' },
    { word: 'house', image: 'images/house.png', hint: '人们居住的地方' },
    { word: 'cat', image: 'images/cat.png', hint: '常见的宠物，会喵喵叫' },
    { word: 'book', image: 'images/book.png', hint: '用来阅读的物品，有很多页' },
    { word: 'tree', image: 'images/tree.png', hint: '有树干和树叶的植物' },
    { word: 'dog', image: 'images/dog.png', hint: '人类最好的朋友，会汪汪叫' },
    { word: 'sun', image: 'images/sun.png', hint: '天空中发光发热的天体' },
    { word: 'car', image: 'images/car.png', hint: '有四个轮子的交通工具' },
    { word: 'fish', image: 'images/fish.png', hint: '生活在水中的动物' },
    { word: 'bird', image: 'images/bird.png', hint: '有翅膀会飞的动物' },
    { word: 'moon', image: 'images/moon.png', hint: '夜空中的天体，围绕地球运行' },
    { word: 'chair', image: 'images/chair.png', hint: '用来坐的家具' }
];

// 游戏状态变量
let currentWord = '';
let currentWordObj = null;
let guessedLetters = [];
let score = 0;
let availableLetters = [];

// DOM元素
const wordDisplay = document.getElementById('word-display');
const wordImage = document.getElementById('word-image');
const letterButtons = document.getElementById('letter-buttons');
const scoreValue = document.getElementById('score-value');
const newGameBtn = document.getElementById('new-game-btn');
const nextWordBtn = document.getElementById('next-word-btn');
const hintBtn = document.createElement('button');

// 初始化游戏
function initGame() {
    score = 0;
    scoreValue.textContent = score;
    setupHintButton();
    nextWord();
}

// 设置提示按钮
function setupHintButton() {
    hintBtn.className = 'control-btn';
    hintBtn.textContent = '提示';
    hintBtn.addEventListener('click', showHint);
    
    const gameControls = document.querySelector('.game-controls');
    if (!document.getElementById('hint-btn')) {
        hintBtn.id = 'hint-btn';
        gameControls.appendChild(hintBtn);
    }
}

// 显示提示
function showHint() {
    if (currentWordObj) {
        alert(`提示: ${currentWordObj.hint}`);
        // 使用提示会扣分
        score -= 2;
        scoreValue.textContent = score;
    }
}

// 选择下一个单词
function nextWord() {
    // 随机选择一个单词
    const randomIndex = Math.floor(Math.random() * wordData.length);
    currentWordObj = wordData[randomIndex];
    currentWord = currentWordObj.word;
    guessedLetters = [];
    
    // 更新图片
    wordImage.src = currentWordObj.image;
    wordImage.alt = `猜猜这是什么: ${currentWord}`;
    
    // 更新单词显示
    updateWordDisplay();
    
    // 生成字母按钮
    generateLetterButtons();
}

// 更新单词显示
function updateWordDisplay() {
    wordDisplay.innerHTML = '';
    
    for (const letter of currentWord) {
        const span = document.createElement('span');
        span.className = 'letter';
        
        if (guessedLetters.includes(letter)) {
            span.textContent = letter;
        } else {
            span.textContent = '_';
        }
        
        wordDisplay.appendChild(span);
    }
    
    // 检查是否猜对了整个单词
    checkWinCondition();
}

// 检查是否赢了
function checkWinCondition() {
    if (currentWord.split('').every(letter => guessedLetters.includes(letter))) {
        // 增加分数
        score += 10;
        scoreValue.textContent = score;
        
        // 禁用所有字母按钮
        disableAllLetterButtons();
        
        setTimeout(() => {
            alert('恭喜你猜对了!');
        }, 300);
    }
}

// 禁用所有字母按钮
function disableAllLetterButtons() {
    const buttons = letterButtons.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// 生成字母按钮
function generateLetterButtons() {
    letterButtons.innerHTML = '';
    
    // 创建可用字母数组（当前单词的字母加上一些随机字母）
    availableLetters = [...currentWord];
    
    // 添加一些随机字母作为干扰
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const extraLettersCount = Math.min(10, 26 - currentWord.length);
    
    for (let i = 0; i < extraLettersCount; i++) {
        let randomLetter;
        do {
            randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (availableLetters.includes(randomLetter));
        
        availableLetters.push(randomLetter);
    }
    
    // 打乱字母顺序
    shuffleArray(availableLetters);
    
    // 创建字母按钮
    availableLetters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-btn';
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterClick(letter, button));
        letterButtons.appendChild(button);
    });
}

// 处理字母点击
function handleLetterClick(letter, button) {
    // 禁用按钮防止重复点击
    button.disabled = true;
    
    // 如果字母在当前单词中
    if (currentWord.includes(letter)) {
        guessedLetters.push(letter);
        button.style.backgroundColor = '#27ae60'; // 正确的字母显示绿色
        score += 1;
    } else {
        button.style.backgroundColor = '#e74c3c'; // 错误的字母显示红色
        score -= 1;
    }
    
    // 更新分数和单词显示
    scoreValue.textContent = score;
    updateWordDisplay();
}

// 打乱数组顺序的辅助函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    newGameBtn.addEventListener('click', initGame);
    nextWordBtn.addEventListener('click', nextWord);
    
    // 初始化游戏
    initGame();
});

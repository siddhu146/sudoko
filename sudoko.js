// Global variables
let res = null;

// Function to generate buttons in each row
function generateRow(i, n) {
    let html = '';
    for (let j = 0; j < n; j++) {
        html += `<input class="button" type="number" min="1" max="${n}" data-i-val="${i}" data-j-val="${j}">`;
    }
    return html;
}

// Function to generate the entire grid
function generateGrid(n) {
    let html = '';
    for (let i = 0; i < n; i++) {
        html += `<div class="row">
                    ${generateRow(i, n)}
                </div>`;
    }

    // Inject HTML into the DOM
    document.querySelector('.input').innerHTML = html;
    document.querySelector('.solve').innerHTML = `
        <button class="solve-button">SOLVE</button>
        <button class="refresh">REFRESH</button>
    `;
}

// Function to create a matrix of size n
function initializeMatrix(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = new Array(n).fill(0);
    }
    return arr;
}

// Function to display the matrix
function display(matrix) {
    document.querySelectorAll('.button').forEach((button) => {
        let i = parseInt(button.dataset.iVal, 10);
        let j = parseInt(button.dataset.jVal, 10);
        button.value = matrix[i][j];
    });
}

// Function to clear the grid
function refresh() {
    res = null; // Reset result matrix
    document.querySelectorAll('.button').forEach((button) => {
        button.value = '';
    });
}

// Function to validate the initial Sudoku grid
function initialCheck(matrix, n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] !== 0) {
                if (!satisfy(matrix, i, j, matrix[i][j], n)) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Recursive helper function for solving the Sudoku
function helper(matrix, dp, n, i, j) {
    if (j === n) {
        res = matrix;
        return true;
    }
    if (i === n) {
        return helper(matrix, dp, n, 0, j + 1);
    }
    if (dp[i][j] === 1) {
        return helper(matrix, dp, n, i + 1, j);
    }
    for (let num = 1; num <= n; num++) {
        if (satisfy(matrix, i, j, num, n)) {
            matrix[i][j] = num;
            if (helper(matrix, dp, n, i + 1, j)) {
                return true;
            }
            matrix[i][j] = 0; // Backtrack
        }
    }
    return false;
}

// Function to check if placing a number is valid
function satisfy(matrix, x, y, num, n) {
    for (let k = 0; k < n; k++) {
        if ((matrix[x][k] === num && k !== y) || (matrix[k][y] === num && k !== x)) {
            return false;
        }
    }

    let subGridSize = Math.sqrt(n);
    let startX = Math.floor(x / subGridSize) * subGridSize;
    let startY = Math.floor(y / subGridSize) * subGridSize;

    for (let i = startX; i < startX + subGridSize; i++) {
        for (let j = startY; j < startY + subGridSize; j++) {
            if (matrix[i][j] === num && (i !== x || j !== y)) {
                return false;
            }
        }
    }
    return true;
}

// Solve function
function solve(matrix, n) {
    let dp = initializeMatrix(n);

    if (!initialCheck(matrix, n)) {
        document.querySelector('.instructions').innerHTML = `<p class="instruction-text">Cannot form a valid Sudoku</p>`;
        return;
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            dp[i][j] = matrix[i][j] !== 0 ? 1 : 0;
        }
    }

    if (helper(matrix, dp, n, 0, 0)) {
        display(res);
    } else {
        document.querySelector('.instructions').innerHTML = `<p class="instruction-text">Cannot form a valid Sudoku</p>`;
    }
}

// Event listener for selecting grid size
document.querySelectorAll('.select-button').forEach((button) => {
    button.addEventListener('click', () => {
        let n = parseInt(button.dataset.valN, 10);

        // Validate that n is a perfect square
        if (Math.sqrt(n) % 1 !== 0) {
            alert('Invalid grid size! n must be a perfect square.');
            return;
        }

        res = initializeMatrix(n);
        generateGrid(n);

        let sudokuMatrix = initializeMatrix(n);

        // Solve button logic
        document.querySelector('.solve-button').addEventListener('click', () => {
            let count = 0;
            document.querySelectorAll('.button').forEach((button) => {
                let i = parseInt(button.dataset.iVal, 10);
                let j = parseInt(button.dataset.jVal, 10);
                let val = parseInt(button.value, 10);
                sudokuMatrix[i][j] = isNaN(val) ? 0 : val;

                if (val > n || val < 0) count++;
            });

            if (count > 0) {
                alert(`Enter numbers between 1 and ${n}`);
            } else {
                solve(sudokuMatrix, n);
            }
        });

        // Refresh button logic
        document.querySelector('.refresh').addEventListener('click', refresh);
    });
});

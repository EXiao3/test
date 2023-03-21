function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'I') {
        return [
            [0, 3, 0, 0],
            [0, 3, 0, 0],
            [0, 3, 0, 0],
            [0, 3, 0, 0],
            
        ];
    } else if (type === 'S') {
        return [
            [0, 0, 0],
            [0, 4, 4],
            [4, 4, 0],
        ];
    } else if (type === 'Z') {
        return [
            [0, 0, 0],
            [5, 5, 0],
            [0, 5, 5],
        ];
    } else if (type === 'L') {
        return [
            [0, 6, 0],
            [0, 6, 0],
            [0, 6, 6],
        ];
    } else if (type === 'J') {
        return [
            [0, 7, 0],
            [0, 7, 0],
            [7, 7, 0],
        ];
    }
}


const tetri = [];


const playerElements = document.querySelectorAll('.player');
[...playerElements].forEach(element => {   
    const tetris = new Tetris(element);
    tetri.push(tetris);
});

/*
document.addEventListener('keydown', event => {
    const player = tetri[0].player;
    if (event.key === "ArrowLeft") {
        player.move(-1);
    } else if (event.key === "ArrowRight") {
        player.move(+1);
    } else if (event.key === "ArrowDown") {
        player.drop();
    } else if (event.key === "ArrowUp") {
        player.rotate(1);
    } else if (event.key === "a") { // I am implementing it this way because it makes the most sense - can use both bottons for rotation 
        player.rotate(-1); // anticlockwise 
    } else if (event.key === "d") {
        player.rotate(1); // clockwise 
    }
});
*/

const keyListener = (event) => {
    [
        ["a", "d", "s", "w"],
        ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"],
    ].forEach((key, index) => {
        const player = tetri[index].player;
        if (event.type === 'keydown') {
            if (event.key === key[0]) {
                player.move(-1);
            } else if (event.key === key[1]) {
                player.move(1);
            } else if (event.key === key[3]) {
                player.rotate(1);
            }
        }
        if (event.key === key[2]) {
            if (event.type === 'keydown') {
                if (player.dropInterval !== player.dropFast) {
                    player.drop();
                    player.dropInterval = player.dropFast;
                }
            } else {
                player.dropInterval = player.dropSlow;
            }
        }
    });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);

 
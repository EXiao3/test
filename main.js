const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://localhost:9000');

const keyListener = (event) => {
    [
        ["a", "d", "s", "w"],
        ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"],
    ].forEach((key, index) => {
        const player = localTetris.player;
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

 
const tetrisManager = new TetrisManager(document);
const tetrisLocal = tetrisManager.createPlayer();
tetrisLocal.element.classList.add('local');
tetrisLocal.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://localhost:9000');

const keyListener = (event) => {
    [
        ['a', 'd', 'w', 's'],
    ].forEach((key, index) => {
        const player = tetrisLocal.player;
        if (event.type === 'keydown') {
            if (event.key === key[0]) {
                player.move(-1);
            } else if (event.key === key[1]) {
                player.move(1);
            // } else if (event.keyCode === key[2]) {
            //     player.rotate(-1);
            } else if (event.key === key[2]) {
                player.rotate(1);
            }
        }

        if (event.key === key[3]) {
            if (event.type === 'keydown') {
                if (player.dropInterval !== player.DROP_FAST) {
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.DROP_SLOW;
            }
        }
    });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);

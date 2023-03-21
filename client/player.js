class Player
{
    constructor(tetris)
    {
        this.DROP_SLOW = 1000;
        this.DROP_FAST = 50;

        this.events = new Events;

        this.tetris = tetris;
        this.arena = tetris.arena;
        this.ghost = tetris.ghost;

        this.dropCounter = 0;
        this.dropInterval = this.DROP_SLOW;

        this.pos = {x: 0, y: 0};
        this.matrix = null;
        this.score = 0;

        this.reset();
    }

    createPiece(type)
    {
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
        } else if (type === 'L') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    drop()
    {
        this.pos.y++;
        this.dropCounter = 0;
        if (this.arena.collide(this)) {
            this.pos.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep();
            this.events.emit('score', this.score);
            return;
        }
        this.events.emit('pos', this.pos);
    }

    move(dir)
    {
        this.pos.x += dir;
        if (this.arena.collide(this)) {
            this.pos.x -= dir;
            return;
        }
        if (this.arena.collide(this.ghost)) {
            this.ghost.pos.x -= dir;
            this.ghost.ghostRow(this);
            return;
        } else {    
            this.ghost.ghostSetPosition(this);
        }

        this.events.emit('pos', this.pos);
    }

    reset()
    {
        const pieces = 'ILJOTSZ';
        this.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
                     (this.matrix[0].length / 2 | 0);

        this.ghost.ghostCreatePiece(this);

        if (this.arena.collide(this)) {
            this.arena.clear();
            this.score = 0;
            this.tetris.updateScore(this.score);
            this.ghost.ghostRow(this);
            this.events.emit('score', this.score);
        }

        this.events.emit('pos', this.pos);
        this.events.emit('matrix', this.matrix);
    }

    rotate(dir)
    {
        const pos = this.pos.x;
        let offset_player = 1;
        let offset_ghost = 1;
        this._rotateMatrix(this.matrix, dir);
        this._rotateMatrix(this.ghost.matrix, dir);
        this.ghost.ghostRow(this);
        while (this.arena.collide(this)) {
            this.pos.x += offset_player;
            offset_player = -(offset_player + (offset_player > 0 ? 1 : -1));
            if (offset_player > this.matrix[0].length) {
                this._rotateMatrix(this.matrix, -dir);
                this.pos.x = pos;
                return;
            }
        }
        while (this.arena.collide(this.ghost)) {
            this.ghost.pos.x += offset_ghost;
            offset_ghost = -(offset_ghost + (offset_ghost > 0 ? 1 : -1));
            if (offset_ghost > this.ghost.matrix[0].length) {
                this._rotateMatrix(this.ghost.matrix, -dir);
                this.ghost.pos.x = pos;
                return;
            }
        }

        this.ghost.ghostSetPosition(this);
        this.events.emit('matrix', this.matrix);
    }

    _rotateMatrix(matrix, dir)
    {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    update(deltaTime)
    {
        this.dropCounter += deltaTime;

        if (this.score >= (this.level + 20) && this.dropInterval > 100) {
            this.dropInterval *= 0.95;
            this.level += 20;
        }


        
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }
}

class Player
{
    constructor(tetris)
    {
        this.tetris = tetris;
        this.arena = tetris.arena;
        this.ghost = tetris.ghost;

        this.dropSlow = 1000;
        this.dropFast = 50;

        this.dropCounter = 0;
        this.dropInterval = this.dropSlow; /* value of this determines how fast it drops */
        this.pos= {x: 0, y: 0};
        this.matrix= null;
        this.score= 0;
        this.level = 0;
        this.reset();
    }

    createPiece(type) {
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

    move(direction) 
    {
        this.pos.x += direction;
        
        if (this.arena.collide(this)) {
            this.pos.x -= direction;
        } /* this stops it from exiting the screen */
    
        if (this.arena.collide(this)) {
            this.ghost.pos.x -= direction;
            this.ghost.ghostRow(this);
        }
        else 
        {
            this.ghost.ghostSetPosition(this);
        }
    }

    rotate(direction) {
        let pos_player = this.pos.x;
        let pos_ghost = this.ghost.pos.x;
        let offset_player = 1;
        let offset_ghost = 1;
        this.rotateMatrix(this.matrix, direction);
        this.rotateMatrix(this.ghost.matrix, direction);
        this.ghost.ghostRow(this);
    
        while (this.arena.collide(this)) {
            this.pos.x += offset_player;
            offset_player = -(offset_player + (offset_player > 0 ? 1 : -1)); /* if the piece is still colliding then new offset is found >> goes up by one and then negates it */
            if (offset_player > this.matrix[0].length) { /* we've moved too far */
                this.rotateMatrix(this.matrix, - direction);
                this.pos.x = pos_player;
                
                return;
            }
        }
        while (this.arena.collide(this.ghost)) {
            this.ghost.pos.x += offset_ghost;
            offset_ghost = -(offset_ghost + (offset_ghost > 0 ? 1 : -1)); /* if the piece is still colliding then new offset is found >> goes up by one and then negates it */
            if (offset_ghost > this.ghost.matrix[0].length) { /* we've moved too far */
                this.rotateMatrix(this.ghost.matrix, - direction);
                this.ghost.pos.x = pos_player;
                return; 
            }
        }

        this.ghost.ghostSetPosition(this);
    }

    /* rotate function transposes the matrix and then flips it */
    rotateMatrix(matrix, direction) {
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

        if (direction > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    drop() 
    {
        this.pos.y++;
        if (this.arena.collide(this)) {
            this.pos.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep(this.tetris);
            this.tetris.updateScore(this.score);
        }
        this.dropCounter = 0;
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

    reset() {
        const pieces = 'ILOZSTJ';
        this.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
                       (this.matrix[0].length / 2 | 0); /* centers pieces when they appear */
    
        this.ghost.ghostCreatePiece(this);
    
        if (this.arena.collide(this)) {
            this.arena.clear();
            this.score = 0;
            this.tetris.updateScore(this.score);
            this.ghost.ghostRow(this);
            this.dropInterval = 1000;
            this.level = 0;
        }
    }

    
    
}

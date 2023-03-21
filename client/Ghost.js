class Ghost
{
    constructor(tetris)
    {
        this.tetris = tetris;
        this.arena = tetris.arena;
        this.player = tetris.player;

        this.matrix = null;
        this.pos = {x: 0, y: 0};
    }  
    
    ghostCreatePiece(player) {
        this.ghostColour(player.matrix);
        this.ghostSetPosition(player);
    }
    
    // ghostRow() {
    //     for (let i = this.arena.matrix.length; i > 1; --i) {
    //         this.pos.y = i;
    //         if (!this.arena.collide(this)) {
    //             this.pos.y = i - 1;
    //             break;
    //         }
    //     }
    // }

    ghostRow(player) {
        for (let i = player.pos.y; i < this.arena.matrix.length; ++i) {
            this.pos.y = i;
            if (this.arena.collide(this)) {
                this.pos.y = i - 1;
                break;
            }
        }
    }
    
    ghostSetPosition(player) {
        this.pos.x = player.pos.x;
        this.ghostRow(player);
    }
    
    ghostColour(matrix) {
        this.matrix = [];
        for (let i = 0; i < matrix.length; i++) {
            this.matrix[i] = matrix[i].slice();
          }
        
        for (let i = 0; i < matrix.length; ++i) {
            for (let j = 0; j < matrix[i].length; ++j) {
              // replace the non-zero values with 1
              if (matrix[i][j] !== 0) {
                this.matrix[i][j] = 8;
              }
            }
          }
        return this.matrix;
    }
}

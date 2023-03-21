class Arena
{
    constructor(w, h)
    {  
        const matrix = [];
        while (h--) { /* while h is not 0*/
            matrix.push(new Array(w).fill(0));
            }       
        this.matrix = matrix;
    }

    sweep() {
    let rowCount = 1;
    let score = 0;
    outer: for (let y = this.matrix.length - 1; y > 0; --y) {
        for (let x = 0; x < this.matrix[y].length; ++x) {
            if (this.matrix[y][x] === 0) {
                continue outer;
            }
        }

        const row = this.matrix.splice(y, 1)[0].fill(0);
        this.matrix.unshift(row);
        ++y;

        score += rowCount * 10; /* this means that each row is double the value of the previous row me thinks */
        rowCount *= 2;
        }
        return score;
    }

    /* collide function checks if the square in the arena is 0 or not
   if it isn't 0 and the block matrix also has a value of non-0 return there has been a collision */
    collide(player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0  &&
                   (this.matrix[y + o.y] && this.matrix[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    clear()
    {
        this.matrix.forEach(row => row.fill(0));
    }

    /* merge function helps us note the location of the bricks in relation to the playable grid or arena */
    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.matrix[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    } 
}
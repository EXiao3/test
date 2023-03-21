class Tetris
{
    constructor(element)
    {
        this.element = element;
        this.canvas = element.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(25, 25);

        this.arena = new Arena(12,20) /* creates a grid of the width and height from index.html divided by scale */
        console.log(this.arena); console.table(this.arena);
        this.ghost = new Ghost(this);
        this.player = new Player(this);  

        let lastTime = 0;
        const update = (time = 0) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            
            
            /* this could possibly used for the side to side movement too */
            
            this.player.update(deltaTime);
            this.draw();
            requestAnimationFrame(update);
        };
        
        this.colours = [ //changed colours to official tetris block colours (still kept the others in comment)
        null,
        "#f30bf7", // T
        "#7f16d2", // O
        '#38ecf3', // I
        '#f579ff', // S
        '#097279', // Z
        '#F32d75', // L
        '#0000ff', // J
        '#3f3f3f', // ghost
    
        ]

        update();
        this.updateScore(0);
    }

    draw() {
        /* this will clear canvas everytime there is an update */
        this.context.fillStyle = '#000'; /* fills background with black */
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    
        this.drawMatrix(this.arena.matrix, {x: 0, y: 0});
        this.drawMatrix(this.ghost.matrix, this.ghost.pos);
        this.drawMatrix(this.player.matrix, this.player.pos);
        
        
    }
    
    drawMatrix(matrix, offset){ 
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0){
                    this.context.fillStyle = this.colours[value];
                    this.context.fillRect(x + offset.x,
                                     y + offset.y,
                                     0.9, 0.9);
                }
    
                // makes a grid - not my intention but could work
                // else {
                //     context.fillStyle = 'white';
                //     context.fillRect(x + offset.x,
                //                      y + offset.y,
                //                      0.9, 0.9);
                // }
            });
        });
    
    }

    updateScore(score)
    {
        this.element.querySelector('.score').innerText = score;
    }
}
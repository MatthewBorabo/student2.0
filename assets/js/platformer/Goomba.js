import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Enemy extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, enemyData){
        super(canvas, 
            image, 
            speedRatio,
            enemyData.width, 
            enemyData.height, 
        );

        // Player Data is required for Animations
        this.enemyData = enemyData;
        this.x = 0.3 * GameEnv.innerWidth;
        this.speedChangeInterval = 1390; // Time interval to change speed (in milliseconds)
        this.lastSpeedChange = Date.now(); // Track the time of the last speed change
        this.scaledCharacterHeightRatio = (1/20);
        this.isGoomba = true;
    }

    update() {
        const currentTime = Date.now();
        
        // Check if it's time to change the speed
        if (currentTime - this.lastSpeedChange >= this.speedChangeInterval) {
            // Generate a random value to adjust the speed
            const randomSpeedChange = Math.random() * 2 - 1; // Random value between -1 and 1
            this.speed += randomSpeedChange; // Modify the current speed by a random value
            
            // Ensure speed stays within a certain range
            const maxSpeed = 15;
            const minSpeed = 3;
            this.speed = Math.max(Math.min(this.speed, maxSpeed), minSpeed);
            
            this.lastSpeedChange = currentTime; // Update last speed change time
        }

            var direction = this.speed > 0;
            // Check if the enemy is at the left or right boundary
            if (this.x <= 0 && (direction == false||this.speed>=0))  {
                // Change direction by reversing the speed
                this.speed = -this.speed;
            }
            else if(this.x + this.canvasWidth >= GameEnv.innerWidth && (direction == true||this.speed<0)){
                this.speed = -this.speed;
            }

        // Move the enemy
        this.x += this.speed;
    }
}

export default Enemy;
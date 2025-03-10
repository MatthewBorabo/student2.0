import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js'

export class Player extends Character{
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, playerData){
        super(canvas, 
            image, 
            speedRatio,
            playerData.width, 
            playerData.height, 
        );
        // Player Data is required for Animations
        this.playerData = playerData;

        // Player control data
        this.pressedKeys = {};
        this.movement = {left: true, right: true, down: true};
        this.isIdle = true;
        this.stashKey = "d"; // initial key

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        GameEnv.player = this;
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]
        // direction setup
        if (key === "a") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (key === "d") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }i
    
    // check for matching animation
    isAnimation(key) {
        var result = false;
        if (key in this.pressedKeys) {
            result = !this.isIdle;
        }
        
        return result;
    }

    // check for gravity based animation
    isGravityAnimation(key) {
        var result = false;
    
        // verify key is in active animations
        if (key in this.pressedKeys ) {
            result = (!this.isIdle && this.bottom <= this.y)||!this.gravityEnabled;
        }

        // scene for on top of tube animation
        if (!this.movement.down) {
            this.gravityEnabled = false;
            // Pause for two seconds
            setTimeout(() => {   // animation in tube
                // This code will be executed after the two-second delay
                this.movement.down = true;
                this.gravityEnabled = true;
                setTimeout(() => { // move to end of game detection
                    this.x = GameEnv.innerWidth + 1;
                }, 1000);
            }, 2000);
        }
    
        // make sure jump has ssome velocity
        if (result) {
            // Adjust horizontal position during the jump
            const horizontalJumpFactor = 0.1; // Adjust this factor as needed
            this.x += this.speed * horizontalJumpFactor;  
        }
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y) {
            this.setAnimation(this.stashKey);
        }

        return result;
    }
    
    // variables for dash cooldown
    dashTimer;
    cooldownTimer;

    // Player updates
    update() {
        if (this.isAnimation("a")) {
            if (this.movement.left) this.x -= this.speed;  // Move to left
            this.facingLeft = true;
            GameEnv.backgroundSpeed = -this.speed;
        }
        if (this.isAnimation("d")) {
            if (this.movement.right) this.x += this.speed;  // Move to right
            GameEnv.backgroundSpeed = this.speed;
            this.facingLeft = false;
        }
        if (this.isGravityAnimation("w")) {
            if (this.movement.down) this.y -= (this.bottom * .4);  // jump 11% higher than bottom
        }
        if (this.isAnimation("s")) {
            if (this.movement) { // Check if movement is allowed
                if(this.dashTimer) {
                    const moveSpeed = this.speed * 2;
                    this.x += this.facingLeft ? -moveSpeed : moveSpeed;
                }
            }
        }

        // Perform super update actions
        super.update();
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.other.ontop) {
                this.movement.down = false;
                this.x = this.collisionData.touchPoints.other.x;
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
        }
        if (this.collisionData.touchPoints.other.id === "scaffold") {
            // Collision with the left side of the Platform
            if (this.collisionData.touchPoints.other.left && (this.topOfPlatform === true)) {
                this.movement.right = false;
            }
            // Collision with the right side of the platform
            if (this.collisionData.touchPoints.other.right && (this.topOfPlatform === true)) {
                this.movement.left = false;
            }
            // Collision with the top of the player
            //if (this.collisionData.touchPoints.this.ontop) {
            //    this.gravityEnabled = false;
            //    this.topOfPlatform = true; 
            //}
            if (this.collisionData.touchPoints.this.top) {
                this.gravityEnabled = false;
            }
            //if (this.collisionData.touchPoints.this.top) {
            //    this.gravityEnabled = false;
            //    
            //    console.log(this.topOfPlatform + "top")
            //    console.log(this.gravityEnabled + "grav")
            //    //console.log("e");
            //}
        }else{
            this.topOfPlatform = false;
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
            this.gravityEnabled = true;
            
        }

        if (this.collisionData.touchPoints.other.id === "enemy") {
            if (this.y >= this.bottom){ //you died -- you're touching the ground
                //reload current level (death)
                GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            }
            else{//you kill goomba
                this.y -= this.bottom*.2;//bounce
                for(let i = 0; i<GameEnv.gameObjects.length;i++){//loop through current gameObjects
                    if(GameEnv.gameObjects[i].isGoomba){ //look for object with (isGoomba==true) tag
                        //get goomba canvas
                        var goomba = GameEnv.gameObjects[i].canvas; 

                        //remove goomba object
                        GameEnv.gameObjects.splice(i,1);

                        //animation
                        goomba.style["transform-origin"] = "bottom left";
                        goomba.style.transition = "all .3s ease-out";
                        goomba.style.transform = "scaleY(10%)";
                        setTimeout(()=>{
                             goomba.remove(); //remove goomba sprite from current level
                        },600)
                
                    }
                }
            }
        }

        if (this.collisionData.touchPoints.other.id === "enemy2") {
            //reload current level (death)
            GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
        }

        if (this.collisionData.touchPoints.other.id === "power") {
            this.scaledCharacterHeightRatio = 2/10;
            this.size();
            for(let i = 0; i<GameEnv.gameObjects.length;i++){//loop through current gameObjects
                if(GameEnv.gameObjects[i].isMushroom){ //look for object with (isGoomba==true) tag
                    //get goomba canvas
                    GameEnv.gameObjects[i].canvas.remove();
                    GameEnv.gameObjects.splice(i,1);
                }
            }
        }
    }
    
    // Event listener key down
    handleKeyDown(event){
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.isIdle = false;
            }
            if (key === "a") {
                GameEnv.backgroundSpeed2 = -0.1;
                GameEnv.backgroundSpeed = -0.4;
            }
            if (key === "d") {
                GameEnv.backgroundSpeed2 = 0.1;
                GameEnv.backgroundSpeed = 0.4;
            }
        };
        if (event.key === "s") {
            this.canvas.style.filter = 'invert(1)';
            this.dashTimer = setTimeout(() => {
            // Stop the player's running functions
            clearTimeout(this.dashTimer);
            this.dashTimer = null;

            // Start cooldown timer
            this.cooldownTimer = setTimeout(() => {
                clearTimeout(this.cooldownTimer);
                this.cooldownTimer = null;
                }, 4000);
            }, 1000);
        }
    }

    // Event listener key up
    handleKeyUp(event){
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            this.setAnimation(key);  
            // player idle
            this.isIdle = true;     
        
        if (key === "a") {
            GameEnv.backgroundSpeed2 = 0;
            GameEnv.backgroundSpeed = 0;
            }
        if (key === "d") {
            GameEnv.backgroundSpeed2 = 0;
            GameEnv.backgroundSpeed = 0;
            }
        }
        if (event.key === "s") {
            this.canvas.style.filter = 'invert(0)'; //revert to default coloring
        }
    };

    // Override destroy() method from GameObject to remove event listeners
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }
}


export default Player;
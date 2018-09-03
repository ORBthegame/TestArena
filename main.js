const config = {
    type: Phaser.AUTO,                  // Use phaser for rendering
    width: 800,                         // WIdth of the game view (pixels)
    height: 608,                        // Height of the game view (pixels)
    parent: 'game-container',           // Id of the containing DOM-element
    pixelArt: true,                     // Better scaling for pixel-art-sprites
    // zoom: 2.5,                  
    physics: {                          // Initiate physics for the project
        default: 'arcade',              // Arcade type physics (simple)
        arcade: {               
        gravity: { y: 0 }               // Gravity = 0
        }
    },
    scene: {                            // Current scene runs with these functions
        preload: preload,               // Load all assets into our game
        create: create,                 // Spawns objects at the start of the game
        update: update                  // The main GAME-LOOP, runs once every frame
    }
};

const game = new Phaser.Game(config);   // Creates a new game based on the config above
let cursors;                            // Variable to hold arrowkeys input
let player;                             // Variable to hold the player object
let enemy;                              // Variable to hold enmey follow player
let patrollingEnemy;                    // Variable to hold enemy patroll 
let randomWalkEnemy;                    // Random walking enemy
let speed = 200;                        // Walking speed for player

function preload() {                                                            // Load all assets into our game
    this.load.image('tiles', './Assets/DarkDungeonv2_1x.png');                  // Load tiles from the tileset and references it with the key : 'tiles'
    this.load.image('enemy', './Assets/enemy.png');                                    // Load in image to be used as example enemy
    this.load.image('player', './Assets/wizard.png');                           // Load image to be used as player references it with the key : 'tiles'
    this.load.tilemapTiledJSON('map', './Assets/Warlock_Arena.json');           // Load the json map structure created with Tiled. references it with the key : 'map'
}

function create() {
    
    const map = this.make.tilemap({ key: 'map' });                              // Creates a tilemap based on the json object with name 'map' declared in preload
    const tileset = map.addTilesetImage('DarkDungeonv2_1x', 'tiles');           // Combines the tilemaps json-structure with tiles from the tileset 'tiles' declared in preload
    
    const walls_and_floor = map.createStaticLayer('walls_and_floor', tileset, 0, 0);    // Creates a static layer based on layers from Tiled and sets the starting position offset to [0, 0]
    const objects_on_floor = map.createStaticLayer('objects_on_floor', tileset, 0, 0);  
    
    walls_and_floor.setCollisionByProperty({ collision: true });                // If the tile has the property 'collision' from Tiled, it will act as a collision object   
    objects_on_floor.setCollisionByProperty({ collision: true }); 
    
    const debugGraphics = this.add.graphics().setAlpha(0.75);                   // Display where the collision is
    walls_and_floor.renderDebug(debugGraphics, {
        tileColor: null,                                                        // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),        // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)                    // Color of colliding face edges
    });
    
    const spawnPoint = map.findObject('objects', obj => obj.name === 'starting_point');         // Find object in tilemap (json) with name property of 'starting_point'
    player = this.physics.add.sprite(600, 400, 'player');                                       // Spawns and adds physics to the player sprite on the declared spawnpoint and ajdust its scale
    
    const camera = this.cameras.main;                                           // Creates a variable holding the game camera
    camera.startFollow(player);                                                 // Makes the camera variable follow the player
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);              // Set the boundries for the camera follow (so it stops at the edge of the map)
    
    cursors = this.input.keyboard.createCursorKeys();                           // Saves a reference to keyboard keys in the variable 'cursors'
    
    this.physics.add.collider(player, [walls_and_floor, objects_on_floor]);     // Watch for collision between the player and the world layer
    
    /* Code block for enemy follower */
    enemy = this.physics.add.sprite(300, 400, 'enemy');                         // Adds physics and spawns the enemy
    this.physics.add.collider(enemy, [walls_and_floor, objects_on_floor]);      // Enemy collision with walls and objects
    
    this.physics.add.collider(enemy, player);                                   // Enemy collision with player

    /* Code block for enemy patroll */
    patrollingEnemy = this.physics.add.sprite(300, 400, 'enemy').setImmovable();
    this.physics.add.collider(patrollingEnemy, [player, walls_and_floor, objects_on_floor]); 

    /* Code block for random walking enemy */
    randomWalkEnemy = this.physics.add.sprite(200, 500, 'enemy');
    this.physics.add.collider(randomWalkEnemy, [player, walls_and_floor, objects_on_floor]); 
    
    /* for (let i = 0; i < 400; i++){                                              // Loop to spawn multiple enemies
        let positionX = Math.floor((Math.random() * 300) +100);                 // Random number from 100 to 400
        let positionY = Math.floor((Math.random() * 200) +100);                 // Random number from 100 to 300            
        let enemy = this.physics.add.sprite(positionX, positionY, 'enemy');     // Adds physics and spawns the enemy at radom positions generated above
        enemy.body.setVelocityX(positionX/3);                                   // Sets the velocity (movement speed) of the enemy along the x axis
        enemy.body.setVelocityY(positionY/3);                                   // Sets the velocity (movement speed) of the enemy along the Y axis
        this.physics.add.collider(enemy, [walls_and_floor, objects_on_floor]);  // Adds collision between the enemy and map
        this.physics.add.collider(enemy, player);                               // Adds collision between the enemy and player      
    }    */     
}

function update(time, delta) {    
    // Update is the main GAME-LOOP, it is run once every frame
    
    
    this.physics.moveToObject(enemy, player, 100);  // Make enemy move towards player position at 100px/s
    

    /* Code chunk for patrolling enemy, change x velocity depending on x position */
    if(patrollingEnemy.x <= 300) {
        patrollingEnemy.body.setVelocityX(speed);
    }
    if(patrollingEnemy.x >= 600) {
        patrollingEnemy.body.setVelocityX(-speed);
    }

    /* Random walk enemy */
    randX = Math.floor((Math.random() * speed) + 1);    // Set random speed 1 - 200
    randX *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // Set 50% chance of negative X speed
    randY = Math.floor((Math.random() * speed) + 1);    // Set random speed 1 - 200
    randY *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // Set 50% chance of negative Y speed

    randomWalkEnemy.body.setVelocity(randX, randY); // Set random velocity to random walk enemy

    player.body.setVelocity(0);                     // Reset the players velocity to 0 each frame, to make the player stop

    if (cursors.left.isDown) {                      // Horizontal movement
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }

    if (cursors.up.isDown) {                        // Vertical movement
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    player.body.velocity.normalize().scale(speed);                                           // Normalize the players speed when moving diagonally (wont move faster diagonally)
    player.body.debugBodyColor = player.body.touching.none ? '_' : console.log('collision'); // Console log collision when enemy and player collide
}
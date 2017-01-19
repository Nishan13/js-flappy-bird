(function(){
  var getStyle = function(element, style) {
    return parseFloat(window.getComputedStyle(element).getPropertyValue(style));
  };

  var getRandomNumber = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  };

  var highScore = 0;

  var container = document.getElementById("container");
  var width = getStyle(container, "width");
  var height = getStyle(container, "height");

  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  container.appendChild(canvas);

  var background = document.getElementById("background");

  var gameOverMessage = document.getElementById("gameOverMessage");

  var birdSprite = document.getElementById("birdSprite");
  var pipeTopSprite = document.getElementById("pipeTopSprite");
  var pipeBottomSprite = document.getElementById("pipeBottomSprite");

  var gameInterval;

  var gameOverState = false;

  var Bird = function() {
    var that = this;
    this.x = width/2 - 25;
    this.y = height/2;
    this.init = function() {

      this.element = birdSprite;

      document.addEventListener("keydown",function(e) {
        if (e.keyCode === 32) { // 32 = SPACE
          if(!gameOverState){
            console.log("jump");
            that.y -= 75;
          }
        }
      })
    };

    this.checkTopBottomCollision = function() {
      if(this.y + 25 >= height || this.y <=0) {
        game.gameOver();
      }
    }

    this.checkWallCollision = function(obstacleArray) {
      for(var i = 0; i < obstacleArray.length; i++){
        obstacle = obstacleArray[i];
        var firstWallXLeft = obstacle.x;
        var firstWallXRight = obstacle.x + obstacle.width;
        var firstWallYBottom = obstacle.gapPosition;

        var secondWallXLeft = obstacle.x;
        var secondWallXRight = obstacle.x + obstacle.width;
        var secondWallYTop = obstacle.gapSize + obstacle.gapPosition;


        if(that.x + 25 >= firstWallXLeft && that.x - 25 <= firstWallXRight && that.y - 10 < firstWallYBottom) {
          game.gameOver();
        }

        if(that.x + 25 >= secondWallXLeft && that.x - 25 <= secondWallXRight && that.y + 10 > secondWallYTop) {
          game.gameOver();
        }
      }
    }
  };

  var Obstacle = function(x, y, gapPosition) {
    this.x = x;
    this.y = y;
    this.gapPosition = getRandomNumber(100, 300);
    this.width = getRandomNumber(50, 75);
    this.gapSize = getRandomNumber(100, 200);
  }

  var Canvas = function(width, height) {
    var that = this;

    this.context = canvas.getContext('2d');

    this.draw = function(bird, obstacleArray) {
      that.context.clearRect(0, 0, width, height);
      bird.y += 2;
      that.context.beginPath();
      that.context.drawImage(bird.element, width/2 - 25, bird.y - 25, 50, 50);
      that.context.closePath();

      for(var index = 0; index < obstacleArray.length; index++) {
        var currentObstacle = obstacleArray[index];
        currentObstacle.x-=5;

        that.context.beginPath();
        that.context.drawImage(pipeTopSprite, currentObstacle.x, 0, currentObstacle.width, currentObstacle.gapPosition);
        that.context.closePath();

        that.context.beginPath();
        that.context.drawImage(pipeBottomSprite, currentObstacle.x, currentObstacle.gapPosition + currentObstacle.gapSize, currentObstacle.width, height - currentObstacle.gapSize - currentObstacle.gapPosition);
        that.context.closePath();

      }

      bird.checkWallCollision(obstacleArray);
    };
  }

  var Game = function() {
    var that = this;

    this.timeCounter = 0;

    this.score = -2;

    var bird = new Bird();
    bird.init();

    var canvasObj = new Canvas(width, height);

    this.gameOver = function() {
      gameOverMessage.setAttribute("class", "show");
      console.log("Game Over")
      gameOverState = true;
      clearInterval(gameInterval);
      document.addEventListener("keydown", function(e) {
        if(e.which === 32) {

          if(gameOverState){
            console.log("restart");
            that = null;
            bird = null;
            var game = new Game();
            game.init();
          }
        }
      })
    };

    this.init = function(){
      background.style.backgroundPosition = "0 0";
      this.timeCounter = 0;
      this.score = -1;
      document.getElementById("score").innerHTML = "0";
      this.obstacleArray = [];
      console.log("Game Start");
      gameOverMessage.setAttribute("class", "");
      gameOverState = false;
      gameInterval = setInterval(function(){
        that.timeCounter++;
        background.style.backgroundPosition = (-that.timeCounter*3) + "px 0";
        //console.log(that.timeCounter);
        canvasObj.draw(bird, that.obstacleArray);
        bird.checkTopBottomCollision();

        if(that.timeCounter % 100 === 0) {
          var obstacle = new Obstacle(width, 0, 200);
          that.obstacleArray.push(obstacle);
          that.score++;
          if(that.score > highScore) {
            highScore = that.score;
          }
          document.getElementById("highScore").innerHTML = highScore
          if(that.score < 0) {
            document.getElementById("score").innerHTML = "0";
          } else {
            document.getElementById("score").innerHTML = that.score;
          }
        }

        var newObstacleArray = [];
        for(var i = 0; i < that.obstacleArray.length; i++) {
          var currentObstacle = that.obstacleArray[i];
          if(currentObstacle.x > -100){
            newObstacleArray.push(currentObstacle);
          } 
        }
        that.obstacleArray = newObstacleArray;

      }, 10);
    }

  };

  var game = new Game();
  game.init();
})();
/* global $*/

var hungryFish;
var littleFish = [];
var bigFish = [];
var redFish = [];
var myScore;
var background;

function startGame() {
    myGameArea.start();
    getScore();
    hungryFish = new component(40, 30, "https://ubisafe.org/images/fished-clipart-bluefish-6.png", 10, 120, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    background = new component(700, 400, "https://us.123rf.com/450wm/clairev/clairev1503/clairev150300120/38471601-stock-vector-ocean-underwater-theme-background.jpg?ver=6", 0, 0, "image");
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function() {
        var ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.crashWith = function(something) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var theirleft = something.x;
        var theirright = something.x + (something.width);
        var theirtop = something.y;
        var theirbottom = something.y + (something.height);
        var crash = true;
        if ((mybottom < (theirtop + 10)) || (mytop > (theirbottom - 10)) || (myright < (theirleft + 10)) || (myleft > (theirright - 10))) {
            crash = false;
        }
        return crash;
    };
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 700;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.fishEaten = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener("keydown", function(e) {
            myGameArea.key = e.keyCode;
        });
        window.addEventListener("keyup", function(e) {
            myGameArea.key = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
};

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function updateGameArea() {
    var x, y;
    for (var i = 0; i < bigFish.length; i++) {
        if (hungryFish.crashWith(bigFish[i])) {
            myGameArea.stop();
            postScore();
            return;
        }
    }
    myGameArea.clear();
    background.newPos();
    background.update();
    myGameArea.frameNo += 1;
    for (i = 0; i < littleFish.length; i++) {
        if (hungryFish.crashWith(littleFish[i])) {
            myGameArea.fishEaten += 10;
            littleFish.splice(i, 1);
        }
    }
    for (i = 0; i < redFish.length; i++) {
        if (hungryFish.crashWith(redFish[i])) {
            myGameArea.fishEaten += 50;
            redFish.splice(i, 1);
        }
    }
    if (myGameArea.frameNo == 5 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        var minY = myGameArea.canvas.height - 250;
        var maxY = myGameArea.canvas.height - 50;
        y = Math.floor(Math.random()*(maxY-minY+1)+minY);
        bigFish.push(new component(250, 100, "https://img00.deviantart.net/d57f/i/2014/015/7/f/great_white_shark_by_kylgrv-d72ayn2.png", x, y, "image"));
    }
    for (i = 0; i < bigFish.length; i += 1) {
        bigFish[i].x += -3;
        bigFish[i].update();
    }
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
         minY = myGameArea.canvas.height - 270;
         maxY = myGameArea.canvas.height - 30;
        y = Math.floor(Math.random()*(maxY-minY+1)+minY);
        littleFish.push(new component(20, 10, "https://www.goodfreephotos.com/albums/vector-images/yellow-fish-cartoon-vector-clipart.png", x, y, "image"));
    }
    for (i = 0; i < littleFish.length; i += 1) {
        littleFish[i].x += -2;
        littleFish[i].update();
    }
    if (myGameArea.frameNo == 10 || everyinterval(500)) {
        x = myGameArea.canvas.width;
        var minY = myGameArea.canvas.height - 250;
        var maxY = myGameArea.canvas.height - 50;
        y = Math.floor(Math.random()*(maxY-minY+1)+minY);
        redFish.push(new component(20, 10, "http://www.clker.com/cliparts/1/f/a/i/g/d/rainbow-fish-hi.png", x, y, "image"));
    }
    for (i = 0; i < redFish.length; i += 1) {
        redFish[i].x += -5;
        redFish[i].update();
    }
    hungryFish.speedX = 0;
    hungryFish.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {hungryFish.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {hungryFish.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {hungryFish.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {hungryFish.speedY = 2; }
    myScore.text = "SCORE: " + myGameArea.fishEaten;
    myScore.update();
    hungryFish.newPos();
    hungryFish.update();
}

function postScore()
{
    var newScore = {Score: myGameArea.fishEaten};
    var jsonScore = JSON.stringify(newScore);
    var url = "score";
    $.ajax({
        url: url,
        type: "POST",
        data: jsonScore,
        contentType: "application/json; charset=utf-8",
        success: function() {
            getScore();
        }
    })
}

function getScore()
{
    $.getJSON("score", function(data) {
        var scores = "<h2>Previous Scores:</h2>" + "<ul>";
        for(var score in data) {
            var scr = data[score];
            scores += "<li>" + scr.Score + "</li>";
      }
      scores += "</ul>";
      $("#scores").html(scores);
    })
}
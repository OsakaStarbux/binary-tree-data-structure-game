/*
I want to draw lines between nodes so when a node is added
I pass in a reference to the parent node. When the node draws
itself it can reference the parent node's coordinates to draw
the line.

In my game it will be useful to know if the node is a leaf node
with no child nodes. This is either the goal or one of many dead ends.
When a node draws itself it checks for children and colors leaf
nodes in red.
*/

function Tree() {
  this.root = null;
}

Tree.prototype.draw = function() {
  this.root.draw();
};

Tree.prototype.toggleAll = function() {
  this.root.toggleAll();
};

Tree.prototype.checkTreeClicked = function() {
  this.root.checkNodeClicked();
};

Tree.prototype.getNextNode = function() {
  this.root.getNextNode();
};

function Node(val) {
  this.parent = null;
  this.value = val;
  this.left = null;
  this.right = null;
  this.isGoal = false;
  this.isOpen = true;
  this.isLeaf = false;
  this.nextNode = null;
}

Node.prototype.draw = function() {
  if (this.left != null) {
    this.left.draw();
  }

  this.drawNode();

  if (this.parent !== null) {
    this.drawConnection();
  }

  if (this.left === null && this.right === null) {
    this.isLeaf = true;
  }

  if (this.right != null) {
    this.right.draw();
  }
};

Node.prototype.getNextNode = function() {
  if (this.left != null) {
    this.left.getNextNode();
  }

  if (this === currentNode) {
    if (this.left != null && this.left.isOpen === true) {
      this.nextNode = this.left;
    }

    if (this.right != null && this.right.isOpen === true) {
      this.nextNode = this.right;
    }
  }

  if (this.right != null) {
    this.right.getNextNode();
  }
};

Node.prototype.checkNodeClicked = function() {
  // if left node exists call recursively
  if (this.left != null) {
    this.left.checkNodeClicked();
  }
 

  let nodePosition = createVector(this.value.x, this.value.y);
  let clickPosition = createVector(mouseX, mouseY);
  // do something to the current node
  if (nodePosition.dist(clickPosition) < 10) {
    this.clicked();
  }

  // if left node exists call recursively
  if (this.right != null) {
    this.right.checkNodeClicked();
  }
};

Node.prototype.toggleAll = function() {
  // if left node exists call recursively
  if (this.left != null) {
    this.left.toggleAll();
  }
  

  let nodePosition = createVector(this.value.x, this.value.y);
  let clickPosition = createVector(mouseX, mouseY);
  // do something to the current node
  this.toggleSwitch();

  // if left node exists call recursively
  if (this.right != null) {
    this.right.toggleAll();
  }
};

Node.prototype.clicked = function() {
  
  this.toggleSwitch();
};

Node.prototype.drawNode = function() {
  push();
  noStroke();
  if (this.left === null && this.right === null) {
    fill(255, 0, 0);

    if (this.isGoal) {
      fill(255, 255, 0);
    }
  } else {
    fill(255);
  }
  ellipse(this.value.x, this.value.y, 15, 15);
};

Node.prototype.drawConnection = function() {
  if (this.isOpen === true) {
    stroke(0, 255, 0);
  } else {
    stroke(255);
  }

  line(this.value.x, this.value.y, this.parent.value.x, this.parent.value.y);
};

Node.prototype.addNodeLeft = function(data) {
  let newNode = new Node(data);
  newNode.parent = this;
  this.left = newNode;
};

Node.prototype.addNodeRight = function(data) {
  let newNode = new Node(data);
  newNode.parent = this;
  this.right = newNode;
};

Node.prototype.toggleSwitch = function() {
  if (this.left === null || this.right === null || this.isGoal === true) {
    return;
  }
 
  if (this.left.isOpen === true) {
    this.left.isOpen = false;
    this.right.isOpen = true;
  } else {
    this.left.isOpen = true;
    this.right.isOpen = false;
  }
};

Node.prototype.isLeaf = function() {
  return this.left === null && this.right === null;
};

function Mover(x, y) {
  this.x = x;
  this.y = y;
  this.step = 0;
  this.path = null;
}

Mover.prototype.assignPath = function(start, end) {
  this.path = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
};

Mover.prototype.show = function() {
  stroke(255);
  fill(0, 200, 255, 80);
  ellipse(this.x, this.y, 25, 25);
};

function StartButton() {
  this.pos = createVector(100, 100);
}

StartButton.prototype.show = function() {
  stroke(255);
  fill(0, 200, 100);

  ellipse(this.pos.x, this.pos.y, 120, 120);
  fill(255);
  textSize(26);
  textAlign(CENTER, CENTER);
  text(startButtonText, this.pos.x, this.pos.y);
};

StartButton.prototype.checkButtonClicked = function(x, y) {
  
  let distance = dist(this.pos.x, this.pos.y, x, y);

  if (distance < 50) {
    if (!isFinished){
      startWaiting()
    } else {
      
      setUpGame();
    }
    
    
  }
};

let isPlaying;
let isFinished;
let cnv;
let width;
let height;
let tree;
let mover;
let currentNode;
let startMillis;
let currentMillis;
let startTime;
let currentTime;
let waitPeriod;
let tick;
let startButton;
let startCounter;
let countdown;
let msg;
let startButtonText;

function setup() {
 setUpGame();
}
//
function draw() {
 
  
  if (isPlaying) {
    currentMillis = millis();
    if (currentMillis - startMillis >= tick) {
      // do something
      tree.getNextNode();
      currentNode = currentNode.nextNode;
      if (currentNode.isLeaf && !currentNode.isGoal) {
        isPlaying = false;
        isFinished = true;
        msg = "Too bad! Try again.";
        startButtonText = "RESTART";
      } else if (currentNode.isLeaf && currentNode.isGoal) {
        isPlaying = false;
        isFinished = true;
        msg = "You win!";
        startButtonText = "RESTART";
      }
      mover.x = currentNode.value.x;
      mover.y = currentNode.value.y;
      startMillis = currentMillis;
    }
  }

  background(51);
  tree.draw();
  mover.show();
   startButton.show();

  if (isWaiting) {
    currentTime = millis()
    if (currentTime - startTime >= waitPeriod) {
      isPlaying = true;
      isWaiting = false;
      msg = "";
    }
  }
  showMsg();
}

function handleMouse() {
 
  if (isPlaying || isWaiting) {
    tree.checkTreeClicked(mouseX, mouseY);
  } else {
    //check start button for clicks
    startButton.checkButtonClicked(mouseX, mouseY);
  }
}

function showMsg(){
  push();
  stroke(255);
  text(msg, 300, 100);
  pop();
}

function setUpGame(){
  width = 700;
  height = 650;
  cnv = createCanvas(width, height);
  cnv.mousePressed(handleMouse);
  background(51);

  tree = new Tree();
  // on ramp
  let root = new Node({ x: 50, y: height / 2 });
  tree.root = root;
  root.addNodeLeft({ x: 100, y: height / 2 });
  root.left.addNodeLeft({ x: 150, y: height / 2 });
  root.left.left.addNodeLeft({ x: 200, y: height / 2 });
  // junction 1
  root.left.left.left.addNodeLeft({ x: 250, y: height / 2 - 50});
  root.left.left.left.left.addNodeLeft({ x: 300, y: height / 2 - 50});
  root.left.left.left.left.left.addNodeLeft({ x: 350, y: height / 2 - 50});
  root.left.left.left.left.left.left.addNodeRight({ x: 400, y: height / 2});
  root.left.left.left.left.left.left.right.addNodeRight({ x: 450, y: height / 2});
  root.left.left.left.left.left.left.right.right.addNodeRight({ x: 500, y: height / 2 + 50});
  root.left.left.left.left.left.left.right.right.right.addNodeLeft({ x: 550, y: height / 2});
  
  root.left.left.left.left.left.left.right.right.right.addNodeRight({ x: 550, y: height / 2 + 100});
  
  root.left.left.left.left.left.left.right.right.addNodeLeft({ x: 500, y: height / 2 - 50});
  
  
  root.left.left.left.addNodeRight({ x: 250, y: height / 2 + 50});
  // junction 2
  root.left.left.left.right.addNodeRight({ x: 300, y: height / 2 + 100});
  root.left.left.left.right.right.addNodeRight({ x: 350, y: height / 2 + 150});
  root.left.left.left.right.right.right.addNodeRight({ x: 400, y: height / 2 + 200});
  root.left.left.left.right.right.right.right.addNodeLeft({ x: 450, y: height / 2 + 150});
  root.left.left.left.right.right.addNodeLeft({ x: 350, y: height / 2 + 50});
  root.left.left.left.right.addNodeLeft({ x: 300, y: height / 2});

  root.left.left.left.right.left.addNodeLeft({ x: 350, y: height / 2});
  root.left.left.left.right.left.left.addNodeRight({ x: 400, y: height / 2 + 50});
  root.left.left.left.right.left.left.right.addNodeRight({ x: 450, y: height / 2 + 100});
root.left.left.left.left.left.left.right.right.left.isGoal = true;
  root.left.left.left.left.left.left.addNodeLeft({ x: 400, y: height / 2 - 100})
  root.left.left.left.left.left.left.left.addNodeRight({ x: 450, y: height / 2 - 50})
  let times = random([1, 2]);

  if (times == 1) {
    tree.toggleAll();
  } else {
    tree.toggleAll();
    tree.toggleAll();
  }

  mover = new Mover(root.value.x, root.value.y);
  currentNode = root;
  tick = 500;
  waitPeriod = 3000;
  startMillis = millis();
  isPlaying = false;
  isWaiting = false;
  startButton = new StartButton();
  countdown = 5;
  msg = "Click start to play!";
  isFinished = false;
  startButtonText = "START";
}


function startWaiting(){
  isWaiting = true;
  startTime = millis();
  msg = "get ready!"
}
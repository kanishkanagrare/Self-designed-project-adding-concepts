var pou, sleepy, sleep, hungry, happy, bath, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var nextbg;

function preload(){
sleep=loadImage("Images/sleep.png");
sleepy=loadImage("Images/sleepy.png");
pou=loadImage("Images/normal.png");
hungry=loadImage("Images/hungry.png");
happy=loadImage("Images/happy.png");
bath=loadImage("Images/bath.png");
dirty=loadImage("Images/dirty.png");
drawingRoom=loadImage("Images/drawing room.jpeg");
bedroom=loadImage("Images/bedroom.jpg");
bathroom=loadImage("Images/bathroom.jpg");
kitchen=loadImage("Images/kitchen.jpg");
outside=loadImage("Images/outdoor.jpg");
gameRoom=loadImage("Images/gameroom.jpg");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();
  nextbg= createSprite(280, 100, 25, 25);
  nextbg.shapeColor= 'yellow';

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

 
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  pou=createSprite(200,400,150,150);
  pou.addImage(pou);
  pou.scale=0.5;
  
  feed=createButton("Feed pou");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.outside();
   }
   else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }
   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.bathroom();
   }
   else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     pou.remove();
   }
   else{
    feed.show();
    addFood.show();
    pou.addImage(pou);
   }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  pou.addImage(happy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
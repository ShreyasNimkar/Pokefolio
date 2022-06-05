const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");
// console.log(battlezonesdata)

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// console.log(ctx)

// console.log(collisions)

// const collisionsmap = []
// for (let i = 0; i < collisions.length; i += 80) {
//     collisionsmap.push(collisions.slice(i, 80 + i))
// }

// class Boundary {
//     static width=48
//     static height=48
//     constructor({
//         position
//     }) {
//         this.position = position
//         this.width = 48
//         this.height = 48
//     }
//     drawhehe() {
//         canvas.fillstyle = 'red'
//         ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
//     }
// }

// const boundaries = []

// collisionsmap.forEach((row,i) => {
//     row.forEach((symbol,j) => {
//         if (symbol===1025)
//             boundaries.push(new Boundary({
//                 x: j*Boundary.width,
//                 y: i*Boundary.height
//         }))
//     })
// })

// console.log(boundaries)

const collisionsmap = [];
for (let i = 0; i < collisions.length; i += 80) {
  collisionsmap.push(collisions.slice(i, i + 80));
}

const battlezonesmap = [];
for (let i = 0; i < battlezonesdata.length; i += 80) {
  battlezonesmap.push(battlezonesdata.slice(i, i + 80));
}

console.log(battlezonesmap);

const boundaries = [];
const offset = {
  x: -468,
  y: -760,
};
collisionsmap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

// console.log(boundaries)

const battlezones = [];

battlezonesmap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 504)
      battlezones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

console.log(battlezones);

const imagevar = new Image();
imagevar.src = "./FinalAssets/Main_Map_Zoomed.png";
const foregroundimage = new Image();
foregroundimage.src = "./FinalAssets/foregroundobjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./FinalAssets/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./FinalAssets/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./FinalAssets/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./FinalAssets/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: imagevar,
});
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundimage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

// const testboundary = new Boundary({
//     position:{
//         x:400,
//         y:400
//     }
// })

const movables = [background, ...boundaries, foreground, ...battlezones];

function rectangularcollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battlezones.forEach((battlezone) => {
    battlezone.draw();
  });
  player.draw();
  // boundaries.forEach(boundary =>{
  //     boundary.drawhehe()
  // })
  foreground.draw();

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battlezones.length; i++) {
      const battlezone = battlezones[i];
      if (
        rectangularcollision({
          rectangle1: player,
          rectangle2: battlezone,
        })
      ) {
        console.log("battlezonecolliding");
        window.location =
          "https://www.youtube.com/watch?v=R9rmw8g82Js&ab_channel=burakzeytinci";
        break;
      }
    }
  }

  let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastkeypressed == "w") {
    player.moving = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularcollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        // console.log("colliding")
        moving = false;
        break;
      }
    }

    if (moving == true) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
    // background.position.y += 3
    // testboundary.position.y += 3
  } else if (keys.a.pressed && lastkeypressed == "a") {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularcollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        // console.log("colliding")
        moving = false;
        break;
      }
    }
    if (moving == true) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
    // background.position.x += 3
  } else if (keys.s.pressed && lastkeypressed == "s") {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularcollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        // console.log("colliding")
        moving = false;
        break;
      }
    }
    if (moving == true) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
    // background.position.y -= 3
  } else if (keys.d.pressed && lastkeypressed == "d") {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularcollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        // console.log("colliding")
        moving = false;
        break;
      }
    }
    if (moving == true) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
    // background.position.x -= 3
  }
  // else if (keys.a.pressed && keys.w.pressed){
  //     background.position.y+=3
  //     background.position.x+=3
  // }
}
animate();

let lastkeypressed = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      // console.log("w is pressed")
      lastkeypressed = "w";
      break;
    case "a":
      keys.a.pressed = true;
      // console.log("a is pressed")
      lastkeypressed = "a";
      break;
    case "s":
      keys.s.pressed = true;
      // console.log("s is pressed")
      lastkeypressed = "s";
      break;
    case "d":
      keys.d.pressed = true;
      // console.log("d is pressed")
      lastkeypressed = "d";
      break;
  }
  // console.log(keys)
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      // console.log("w is removed")
      break;
    case "a":
      keys.a.pressed = false;
      // console.log("a is removed")
      break;
    case "s":
      keys.s.pressed = false;
      // console.log("s is removed")
      break;
    case "d":
      keys.d.pressed = false;
      // console.log("d is removed")
      break;
  }
  // console.log(keys)
});

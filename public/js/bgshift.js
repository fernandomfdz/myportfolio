(function () {
  var HALF_PI = 0.5 * Math.PI;
  var TAU = 2 * Math.PI;
  var TO_RAD = Math.PI / 180;
  var floor = (n) => n | 0;
  var rand = (n) => n * Math.random();
  var randIn = (min, max) => rand(max - min) + min;
  var randRange = (n) => n - rand(2 * n);
  var fadeIn = (t, m) => t / m;
  var fadeOut = (t, m) => (m - t) / m;
  var fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  var dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  var angle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
  var lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  var circleCount = 150;
  var circlePropCount = 8;
  var circlePropsLength = circleCount * circlePropCount;
  var baseSpeed = 0.000004;
  var rangeSpeed = 0.00004;
  var baseTTL = 150;
  var rangeTTL = 200;
  var baseRadius = 100;
  var rangeRadius = 200;
  var rangeHue = 100;
  var xOff = 0.0015;
  var yOff = 0.0015;
  var zOff = 0.0015;
  var backgroundColor = "#386b82";

  let container;
  let canvas;
  let ctx;
  let circles;
  let circleProps;
  let simplex;
  let baseHue;

  function setup() {
    createCanvas();
    resize();
    initCircles();
    draw();
  }

  function initCircles() {
    circleProps = new Float32Array(circlePropsLength);
    simplex = new SimplexNoise();
    baseHue = 220;

    let i;

    for (i = 0; i < circlePropsLength; i += circlePropCount) {
      initCircle(i);
    }
  }

  function initCircle(i) {
    let x, y, n, t, speed, vx, vy, life, ttl, radius, hue;

    x = rand(canvas.a.width);
    y = rand(canvas.a.height);
    n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
    t = rand(TAU);
    speed = baseSpeed + rand(rangeSpeed);
    vx = speed * Math.cos(t);
    vy = speed * Math.sin(t);
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    radius = baseRadius + rand(rangeRadius);
    hue = baseHue + n * rangeHue;

    circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
  }

  function updateCircles() {
    let i;

    baseHue++;

    for (i = 0; i < circlePropsLength; i += circlePropCount) {
      updateCircle(i);
    }
  }

  function updateCircle(i) {
    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i;
    let x, y, vx, vy, life, ttl, radius, hue;

    x = circleProps[i];
    y = circleProps[i2];
    vx = circleProps[i3];
    vy = circleProps[i4];
    life = circleProps[i5];
    ttl = circleProps[i6];
    radius = circleProps[i7];
    hue = circleProps[i8];

    drawCircle(x, y, life, ttl, radius, hue);

    life++;

    circleProps[i] = x + vx;
    circleProps[i2] = y + vy;
    circleProps[i5] = life;

    (checkBounds(x, y, radius) || life > ttl) && initCircle(i);
  }

  function drawCircle(x, y, life, ttl, radius, hue) {
    ctx.a.save();
    ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
    ctx.a.beginPath();
    ctx.a.arc(x, y, radius, 0, TAU);
    ctx.a.fill();
    ctx.a.closePath();
    ctx.a.restore();
  }

  function checkBounds(x, y, radius) {
    return (
      x < -radius ||
      x > canvas.a.width + radius ||
      y < -radius ||
      y > canvas.a.height + radius
    );
  }

  function createCanvas() {
    container = document.querySelector(".content--canvas");
    canvas = {
      a: document.createElement("canvas"),
      b: document.createElement("canvas"),
    };
    canvas.b.style = `
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    container.appendChild(canvas.b);
    ctx = {
      a: canvas.a.getContext("2d"),
      b: canvas.b.getContext("2d"),
    };
  }

  function resize() {
    var { innerWidth, innerHeight } = window;

    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;

    ctx.a.drawImage(canvas.b, 0, 0);

    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;

    ctx.b.drawImage(canvas.a, 0, 0);
  }

  function render() {
    ctx.b.save();
    ctx.b.filter = "blur(50px)";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
  }

  function draw() {
    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
    updateCircles();
    render();
    window.requestAnimationFrame(draw);
  }

  window.addEventListener("load", setup);
  window.addEventListener("resize", resize);
})();
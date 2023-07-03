let gl, program;
let vertexCount = 36;
let modelViewMatrix;
let projectionMatrix;

let eye = vec3(0, 0, 2);
let at = vec3(0, 0, 0);
let up = vec3(0, 1, 0);

let left = -2;
let right = 2;
let bottom = -2;
let ytop = 2;
let near = 1;
let far = 10;

let zoomFactor = 0.1;

document.onkeydown = handleKeyDown;

function handleKeyDown(event) {
  let key = String.fromCharCode(event.keyCode);

  switch (key) {
    case 'T':
      eye = vec3(0, 1, 0); // Top
      up = vec3(0, 0, 1);
      break;
    case 'L':
      eye = vec3(-1, 0, 0); // Left
      up = vec3(0, 1, 0);
      break;
    case 'F':
      eye = vec3(0, 0, 1); // Front
      up = vec3(1, 0, 0);
      break;
    case 'D':
      rotateCamera(0.5); // Rotate clockwise
      break;
    case 'A':
      rotateCamera(-0.5); // Rotate counter-clockwise
      break;
    case 'I':
      eye = vec3(2, 2, 2); // Isometric
      up = vec3(0, 1, 0); // Reset up vector for isometric view
      break;
    case 'W':
      zoomIn(); // Zoom in
      break;
    case 'S':
      zoomOut(); // Zoom out
      break;
  }
}

function rotateCamera(theta) {
  let cos_t = Math.cos(theta);
  let sin_t = Math.sin(theta);

  let new_X = cos_t * eye[0] - sin_t * eye[1];
  let new_Y = sin_t * eye[0] + cos_t * eye[1];
  eye[0] = new_X;
  eye[1] = new_Y;

  let mvm = lookAt(eye, at, up);
  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

  render();
}

function zoomIn() {
  // zoom in camera
  eye[0] *= 0.9;
  eye[1] *= 0.9;
  eye[2] *= 0.9;
}

function zoomOut() {
  // zoom out camera
  eye[0] *= 1.1;
  eye[1] *= 1.1;
  eye[2] *= 1.1;
}

onload = () => {
  let canvas = document.getElementById("webgl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert('No webgl for you');
    return;
  }

  program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0, 0, 0, 0.5);

  let vertices = [
    -1, -1, 1,
    -1, 1, 1,
    1, 1, 1,
    1, -1, 1,
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,
  ];

  let indices = [
    0, 3, 1,
    1, 3, 2,
    4, 7, 5,
    5, 7, 6,
    3, 7, 2,
    2, 7, 6,
    4, 0, 5,
    5, 0, 1,
    1, 2, 5,
    5, 2, 6,
    0, 3, 4,
    4, 3, 7,
  ];

  let colors = [
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 1, 1,
    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1,
  ];

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');
  projectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let mvm = lookAt(eye, at, up);
  let pm = perspective(45, gl.canvas.width / gl.canvas.height, near, far);

  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));
  gl.uniformMatrix4fv(projectionMatrix, false, flatten(pm));

  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

  requestAnimationFrame(render);
}

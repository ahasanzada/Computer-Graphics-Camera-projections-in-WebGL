let gl, program;
let vertexCount = 36;
let modelViewMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0]; 

document.onkeydown = handleKeyDown;

function handleKeyDown(event) {
    let key = String.fromCharCode(event.keyCode);
    
    switch (key) {
        case 'T':
            eye = [0, 1, 0]; // Top
            up = [0, 0, 1];
            break;
        case 'L':
            eye = [-1, 0, 0]; // Left
            up = [0, 1, 0];
            break;
        case 'F':
            eye = [0, 0, 1]; // Front
            up = [0, 1, 0];
            break;
        case 'D':
            theta= 0.2
            rotateCamera(theta); // Rotate clockwise
            break;
        case 'A':
            theta=-0.2
            rotateCamera(theta); // Rotate counter-clockwise
            break;
    }
}

function rotateCamera(theta) {

  let cos_t = Math.cos(theta);
  let sin_t = Math.sin(theta);

  if (eye[0] === 0 && eye[1] === 1 && eye[2] === 0) {

    let new_Z = cos_t * up[2] - sin_t * up[0];
    let new_X = sin_t * up[2] + cos_t * up[0];
    up[0] = new_X;
    up[2] = new_Z;
  } else if (eye[0] === -1 && eye[1] === 0 && eye[2] === 0) {

    let new_Z = cos_t * up[2] - sin_t * up[1];
    let new_Y = sin_t * up[2] + cos_t * up[1];
    up[1] = new_Y;
    up[2] = new_Z;
  } else {

    let new_X = cos_t * up[0] - sin_t * up[1];
    let new_Y = sin_t * up[0] + cos_t * up[1];
    up[0] = new_X;
    up[1] = new_Y;
  }


  render();
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

    // You should get rid of the line below eventually
    vertices = scale(0.5, vertices); 

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

    render();
};

function render() { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let mvm = lookAt(eye, at, up);

    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

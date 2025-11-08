const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `
precision highp float;

// 🔹 Sem vložíme tvůj kód
float kernal(vec3 ver) {
  vec3 a;
  float b, c, d, e;
  a = ver;
  for (int i = 0; i < 5; i++) {
    b = length(a);
    c = atan(a.y,a.x)*8.0;
    e = 1.0/b;
    d = acos(a.z/b)*8.0;
    b = pow(b,8.0);
    a = vec3(b*sin(d)*cos(c),b*sin(d)*sin(c),b*cos(d)) + ver;
    if (b > 6.0) break;
  }
  return 4.0 - a.x*a.x - a.y*a.y - a.z*a.z;
}

// 🔹 hlavní část, která volá kernal()
void main() {
  vec2 uv = (gl_FragCoord.xy / vec2(800.0, 600.0)) * 2.0 - 1.0;
  vec3 p = vec3(uv, 0.0);
  float v = kernal(p);
  gl_FragColor = vec4(vec3(v * 0.1 + 0.5), 1.0);
}
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1
]), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);

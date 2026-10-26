// Liquid gradient warp background (domain-warped noise in a WebGL shader, no libraries).
(() => {
  const cv = document.getElementById('liquid');
  const gl = cv.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return; // falls back to the CSS gradient on <body>
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;
uniform vec2 r;uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r.xy; uv.x*=r.x/r.y; uv*=1.4;
 float s=t*.07;
 vec2 q=vec2(fbm(uv+vec2(0.,s)),fbm(uv+vec2(5.2,1.3)-s));
 vec2 w=vec2(fbm(uv+3.*q+vec2(1.7,9.2)+s*1.3),fbm(uv+3.*q+vec2(8.3,2.8)-s));
 float f=fbm(uv+3.5*w);
 vec3 deep=vec3(0.,.07,.14), loyal=vec3(0.,.255,.396), bliss=vec3(0.,.376,.58), glow=vec3(.12,.5,.78);
 vec3 c=mix(deep,loyal,smoothstep(.15,.6,f));
 c=mix(c,bliss,smoothstep(.55,.85,f)*.8);
 c=mix(c,deep,smoothstep(.2,.9,length(q))*.35);
 c+=glow*pow(smoothstep(.72,.95,f),2.)*.25;
 gl_FragColor=vec4(c,1.);}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't');
  const scale = 0.5; // render at half resolution: soft look, light on phones
  const resize = () => {
    cv.width = Math.max(2, innerWidth * scale | 0);
    cv.height = Math.max(2, innerHeight * scale | 0);
    gl.viewport(0, 0, cv.width, cv.height);
  };
  addEventListener('resize', resize); resize();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = ms => {
    gl.uniform2f(uR, cv.width, cv.height);
    gl.uniform1f(uT, ms / 1000 * 1.6 + 20);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!still) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

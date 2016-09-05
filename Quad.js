function initTextures(gl) {
  texture = gl.createTexture();
  image = new Image();
  image.onload = function() { handleTextureLoaded(image, texture); }
  image.src = "brain-at_4096.jpg";
  return texture;
}

function handleTextureLoaded(image, texture) {
  app.gl.bindTexture(app.gl.TEXTURE_2D, texture);
  app.gl.texImage2D(app.gl.TEXTURE_2D, 0, app.gl.RGBA, app.gl.RGBA, app.gl.UNSIGNED_BYTE, image);
  app.gl.texParameteri(app.gl.TEXTURE_2D, app.gl.TEXTURE_MIN_FILTER, app.gl.LINEAR);
  app.gl.texParameteri(app.gl.TEXTURE_2D,app.gl.TEXTURE_MAG_FILTER, app.gl.LINEAR);
  //app.gl.texParameteri(app.gl.TEXTURE_2D, app.gl.TEXTURE_WRAP_S, app.gl.CLAMP_TO_EDGE);

  //app.gl.texParameteri(app.gl.TEXTURE_2D, app.gl.TEXTURE_WRAP_T, app.gl.CLAMP_TO_EDGE);
  app.gl.bindTexture(app.gl.TEXTURE_2D, null);
  window.requestAnimationFrame(function (){ app.update();}); // remove this from start()
}

var Quad = function(gl)
{
    this.volume = initTextures(gl);
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array( [ 
               -1.0, -1.0,
               -1.0,  1.0,
                1.0, -1.0,
                1.0, 1.0 ] ),
                gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 2;
    this.vertexBuffer.numItems = 4;
	this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
	
    gl.shaderSource(this.vertexShader, vsQuadSrc );
	
    gl.compileShader(this.vertexShader);
    output.textContent += gl.getShaderInfoLog(this.vertexShader);
	this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
    gl.shaderSource(this.fragmentShader,/*psRayCastSrc*/ psTraceSrc );
	
    gl.compileShader(this.fragmentShader);
    output.textContent +=   gl.getShaderInfoLog(this.fragmentShader); 
	this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);
    output.textContent += gl.getProgramInfoLog(this.program);
	this.positionAttributeIndex = 
	gl.getAttribLocation(this.program, 'vPosition');
	
	this.viewDirMatrixLocation =   
    gl.getUniformLocation(this.program,'viewDirMatrix');
    this.eyeLocation = gl.getUniformLocation(this.program,'eye');
	
	this.quadricsLocation = gl.getUniformLocation(this.program,'quadrics');
	this.materialsLocation = gl.getUniformLocation(this.program,'materials');

	this.volumeLocation = gl.getUniformLocation(this.program,'volume');
	
	 

} // Quad constructor ends


Quad.prototype.draw = function(gl, camera)  {
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray( this.positionAttributeIndex);
	gl.vertexAttribPointer( this.positionAttributeIndex, 2, gl.FLOAT, false, 8, 0);
		  
		  		
    gl.uniform3f(this.eyeLocation, camera.position.x, camera.position.y, camera.position.z);
	viewDirMatrixData = new Float32Array(16);
	camera.viewDirMatrix.copyIntoArray(viewDirMatrixData, 0);
	gl.uniformMatrix4fv(this.viewDirMatrixLocation, false, viewDirMatrixData);
  
    gl.uniform1i(this.volumeLocation, 0);
    gl.bindTexture(gl.TEXTURE_2D, this.volume);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  }
  
  
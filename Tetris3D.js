//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null; 

var cubeVertexPositionBuffer = null;

var cubeVertexColorBuffer = null;

var cubeVertexIndexBuffer = null;

var cubeVertexTextureCoordBuffer;

var bkgVertexPositionBuffer = null;

var bkgVertexColorBuffer = null;

var bkgVertexIndexBuffer = null;

var bkgVertexTextureCoordBuffer;


// The global transformation parameters

var globalAngleZZ = 0.0;

// The translation vector

var tx = 2.5;

var ty = 7.5;

var tyMin = 0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.25;

var sy = 0.25;

var sz = 0.25;

// NEW - Animation controls

var rotationXX_ON = 1;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;

var rotationYY_ON = 1;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;

var rotationZZ_ON = 1;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];

// Model Material Features

// Ambient coef.

var kAmbi = [ 0.2, 0.2, 0.2 ];

// Difuse coef.

var kDiff = [ 0.7, 0.7, 0.7 ];

// Specular coef.

var kSpec = [ 0.7, 0.7, 0.7 ];

// Phong coef.

var nPhong = 100;

// Tracking model
var currentModel = null;
var currentTexture = null;

// model cubes
var c1 = [];
var c2 = [];
var c3 = [];
var c4 = [];

// base cube
var baseC = c1;

// pontuacao
var score = 0;
 
// For storing the vertices defining the triangles

var vertices = [
            
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0	 
];

var bkgVertices = [
			-1.0, -1.0,  1.0,
            21.0, -1.0,  1.0,
            21.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
			
			-1.0, 27.0,  1.0,
			-1.0, 27.0, -1.0,
			
			21.0, 27.0, -1.0
]

var normals = [
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
];

// And their colour

var colors = [

		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 1.00,  0.00,  0.00,
		 	
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,
		 		 
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00		 			 
];
		
var bkgColors = [
		1, 1, 1,
		1, 1, 1,
		1, 1, 1,
		1, 1, 1,
		
		1, 1, 1,
		1, 1, 1,
		
		1, 1, 1
]

var textureCoords = [

          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          0.0, 0.0,
		  0.0, 0.0,
		  
		  1.0, 1.0
];

var bkgTextureCoords = [

          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          0.0, 0.0,
		  0.0, 0.0,
		  
		  1.0, 1.0
];

var cubeVertexIndices = [

            0, 1, 2,      0, 2, 3,    // Front face

            4, 5, 6,      4, 6, 7,    // Back face

            5, 3, 2,      5, 2, 6,  // Top face

            4, 7, 1,      4, 1, 0, // Bottom face

            7, 6, 2,      7, 2, 1, // Right face

            4, 0, 3,      4, 3, 5  // Left face
];

var bkgVertexIndices = [
            0, 1, 2,	2, 3, 0,
			
			0, 3, 5,	5, 4, 0,
			
			3, 2, 6,	6, 5, 3
];
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

function handleLoadedTexture(texture) {
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

var bkgWebGLTexture;
var webGLTexture1;
var webGLTexture2;
var webGLTexture3;
var webGLTexture4;
var webGLTexture5;
var webGLTexture6;
var webGLTexture7;

function initTexture() {
	
	bkgWebGLTexture = gl.createTexture();
	bkgWebGLTexture.image = new Image();
	bkgWebGLTexture.image.onload = function () {
		handleLoadedTexture(bkgWebGLTexture)
	}
	
	bkgWebGLTexture.image.crossOrigin = "anonymous";
	bkgWebGLTexture.image.src = "white.jpg";
	
	webGLTexture1 = gl.createTexture();
	webGLTexture1.image = new Image();
	webGLTexture1.image.onload = function () {
		handleLoadedTexture(webGLTexture1)
	}

	webGLTexture1.image.crossOrigin = "anonymous";
	webGLTexture1.image.src = "darkblue.png";
	
	webGLTexture2 = gl.createTexture();
	webGLTexture2.image = new Image();
	webGLTexture2.image.onload = function () {
		handleLoadedTexture(webGLTexture2)
	}

	webGLTexture2.image.crossOrigin = "anonymous";
	webGLTexture2.image.src = "green.png";
	
	webGLTexture3 = gl.createTexture();
	webGLTexture3.image = new Image();
	webGLTexture3.image.onload = function () {
		handleLoadedTexture(webGLTexture3)
	}

	webGLTexture3.image.crossOrigin = "anonymous";
	webGLTexture3.image.src = "orange.png";
	
	webGLTexture4 = gl.createTexture();
	webGLTexture4.image = new Image();
	webGLTexture4.image.onload = function () {
		handleLoadedTexture(webGLTexture4)
	}

	webGLTexture4.image.crossOrigin = "anonymous";
	webGLTexture4.image.src = "purple.png";
	
	webGLTexture5 = gl.createTexture();
	webGLTexture5.image = new Image();
	webGLTexture5.image.onload = function () {
		handleLoadedTexture(webGLTexture5)
	}

	webGLTexture5.image.crossOrigin = "anonymous";
	webGLTexture5.image.src = "red.png";
	
	webGLTexture6 = gl.createTexture();
	webGLTexture6.image = new Image();
	webGLTexture6.image.onload = function () {
		handleLoadedTexture(webGLTexture6)
	}

	webGLTexture6.image.crossOrigin = "anonymous";
	webGLTexture6.image.src = "yellow.png";
	
	webGLTexture7 = gl.createTexture();
	webGLTexture7.image = new Image();
	webGLTexture7.image.onload = function () {
		handleLoadedTexture(webGLTexture7)
	}

	webGLTexture7.image.crossOrigin = "anonymous";
	webGLTexture7.image.src = "blue.png";
}

// Handling the Vertex and the Color Buffers

function initBuffers() {	
	
	// Coordinates
		
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = vertices.length / 3;
	
	bkgVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bkgVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bkgVertices), gl.STATIC_DRAW);
	bkgVertexPositionBuffer.itemSize = 3;
	bkgVertexPositionBuffer.numItems = bkgVertices.length / 3;	

	// Colors
		
	cubeVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	cubeVertexColorBuffer.itemSize = 3;
	cubeVertexColorBuffer.numItems = vertices.length / 3;	
	
	bkgVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bkgVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bkgColors), gl.STATIC_DRAW);
	bkgVertexColorBuffer.itemSize = 3;
	bkgVertexColorBuffer.numItems = bkgVertices.length / 3;	

	// Textures
		
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 16;	
	
    bkgVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bkgVertexTextureCoordBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bkgTextureCoords), gl.STATIC_DRAW);
    bkgVertexTextureCoordBuffer.itemSize = 2;
    bkgVertexTextureCoordBuffer.numItems = 24;		

	// Vertex indices
	
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
	
    bkgVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bkgVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bkgVertexIndices), gl.STATIC_DRAW);
    bkgVertexIndexBuffer.itemSize = 1;
    bkgVertexIndexBuffer.numItems = 18;
}

//----------------------------------------------------------------------------

//  Drawing cube

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType,
					textureSkin ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );

	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
    // Passing the buffers
    	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	// COLORS
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	
	// Textures
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureSkin);
        
    gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	// The vertex indices
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	// Drawing the triangles --- NEW --- DRAWING ELEMENTS 
	
	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
    
}

//  Drawing the background

function drawBkgModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers
    	
	gl.bindBuffer(gl.ARRAY_BUFFER, bkgVertexPositionBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bkgVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	// COLORS
	gl.bindBuffer(gl.ARRAY_BUFFER, bkgVertexColorBuffer);
    
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, bkgVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bkgVertexIndexBuffer);
	
	// Textures
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bkgWebGLTexture);
        
    gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	// The vertex indices
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bkgVertexIndexBuffer);

	// Drawing the triangles --- NEW --- DRAWING ELEMENTS 
	
	gl.drawElements(gl.LINE_LOOP, bkgVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    
}

// Drawing models

function drawOModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType,
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture1;
					
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawIModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture2;
					
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawLModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture3;
					
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawJModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture4;
	
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawSModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture5;
	
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawZModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture6;
	
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

function drawTModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType, 
					c1, c2, c3, c4 ) {
					
	var tex = webGLTexture7;
	
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c1[0], c1[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c2[0], c2[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c3[0], c3[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
			   
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   c4[0], c4[1], tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

//  Drawing the 3D scene

var statMatrix = [];
var i = 0;
var randomN = 1;

function drawScene() {
	
	var pMatrix;
	var cXMatrix;
	var cYMatrix;
	
	var mvMatrix = mat4();
	
	resize(gl.canvas);
	
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
	// Clearing with the background color
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// NEW --- Computing the Projection Matrix
		
	pMatrix = perspective( 45, gl.canvas.clientWidth/gl.canvas.clientHeight, 0.05, 200 );
	
	cXMatrix = rotationXXMatrix( 15 );
	pMatrix = mult( pMatrix , cXMatrix );
	
	cYMatrix = rotationYYMatrix( -15 );
	pMatrix = mult( pMatrix , cYMatrix );
	
	pMatrix = mult( pMatrix, translationMatrix(-5,-6,-9));
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
			if( lightSources[i].isRotXXOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationXXMatrix( lightSources[i].getRotAngleXX() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
	// Drawing the background
	
	drawBkgModel( 0, 0, 0, 
				  sx, sy, sz,
				  0, 0, 0,
				  mvMatrix,
				  primitiveType );
	
	// Drawing the models
	
	// desenhar modelos ja colocados
	drawStatic(statMatrix.length, mvMatrix);
	
	// calcular modelo aleatorio
	if(currentModel == null) {
		randomN = Math.floor((Math.random() * 7) + 1);
	}
	
	// rodar modelo globalmente
//	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
//	mvMatrix = mult( mvMatrix, rotationZZMatrix( globalAngleZZ ) );
//	mvMatrix = mult( mvMatrix, translationMatrix( -tx, -ty, tz ) );

	// desenhar modelo aleatorio se o jogo nao terminou
	if(!gameOver()) {
		switch(randomN) {
			case(1): currentModel = 'O';
					 updateSquares();
					 currentTexture = webGLTexture1;
					 
					 drawOModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(2): currentModel = 'I';
					 updateSquares();
					 currentTexture = webGLTexture2;
					 
					 drawIModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(3): currentModel = 'L';
					 updateSquares();
					 currentTexture = webGLTexture3;
					 
					 drawLModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(4): currentModel = 'J';
					 updateSquares();
					 currentTexture = webGLTexture4;
					 
					 drawJModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(5): currentModel = 'S';
					 updateSquares();
					 currentTexture = webGLTexture5;
					 
					 drawSModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(6): currentModel = 'Z';
					 updateSquares();
					 currentTexture = webGLTexture6;
					 
					 drawZModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
					 
			case(7): currentModel = 'T';
					 updateSquares();
					 currentTexture = webGLTexture7;
					 
					 drawTModel( angleXX, angleYY, angleZZ,
								 sx, sy, sz,
								 tx, ty, tz,
								 mvMatrix,
								 primitiveType,
								 c1, c2, c3, c4);
					 break;
		}
	}
}

// adaptado de https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize(canvas) {
	var displayWidth = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;
	
	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}
}

// funcao recursiva para desenhar modelos ja colocados

function drawStatic(i, mvMatrix) {		
		while(i > 0) {
			reDrawStatic(--i, mvMatrix);
		}
}

function reDrawStatic(i, mvMatrix) {
	
	var x = statMatrix[i][0][0];
	var y = statMatrix[i][0][1];
	var tex = statMatrix[i][1];
	
	drawModel( angleXX, angleYY, angleZZ, 
			   sx, sy, sz,
			   x, y, tz,
			   mvMatrix,
			   primitiveType,
			   tex );
}

// ver se jogo terminou

function gameOver() {
	if( statMatrix.length == 0 )
		return false;
	
	else {
		if( (statMatrix[statMatrix.length-1][0][1] > 6.5) ) {
			return true;
		}
		else {
			return false;
		}
	}
}

// atualizar posicao dos quadrados quando se roda

function updateSquares() {
	switch (currentModel) {
		case('O'): c1 = [tx, ty-0.25];
				   c2 = [tx+0.5, ty-0.25];
				   c3 = [tx, ty+0.25];
				   c4 = [tx+0.5, ty+0.25];
				   baseC = c1;
				   break;
				   
		case('I'): if(globalAngleZZ == 0 || globalAngleZZ == 180) {
						c1 = [tx, ty-0.75];
						c2 = [tx, ty-0.25];
						c3 = [tx, ty+0.25];
						c4 = [tx, ty+0.75];
						baseC = c1;
				   }
				   else {
						c1 = [tx+1, ty];
						c2 = [tx+0.5, ty];
						c3 = [tx, ty];
						c4 = [tx-0.5, ty];
						baseC = c1;
				   }
				   break;
				   
		case('L'): if(globalAngleZZ == 0) {
						c1 = [tx, ty-0.5];
						c2 = [tx, ty];
						c3 = [tx, ty+0.5];
						c4 = [tx+0.5, ty-0.5];
						baseC = c1;
				   }
				   else if(globalAngleZZ == 90) {
						c1 = [tx-0.5, ty+0.25];
						c2 = [tx, ty+0.25];
						c3 = [tx+0.5, ty+0.25];
						c4 = [tx-0.5, ty-0.25];
						baseC = c4;
				   }
				   else if(globalAngleZZ == 180) {
						c1 = [tx+0.5, ty+0.5];
						c2 = [tx+0.5, ty];
						c3 = [tx+0.5, ty-0.5];
						c4 = [tx, ty+0.5];
						baseC = c3;
				   }
				   else {
						c1 = [tx+0.5, ty-0.25];
						c2 = [tx, ty-0.25];
						c3 = [tx-0.5, ty-0.25];
						c4 = [tx+0.5, ty+0.25];
						baseC = c1;
				   }
				   break;
				
		case('J'): if(globalAngleZZ == 0) {
						c1 = [tx+0.5, ty-0.5];
						c2 = [tx+0.5, ty];
						c3 = [tx+0.5, ty+0.5];
						c4 = [tx, ty-0.5];
						baseC = c1;
				   }
				   else if(globalAngleZZ == 90) {
						c1 = [tx+0.5, ty+0.25];
						c2 = [tx, ty+0.25];
						c3 = [tx-0.5, ty+0.25];
						c4 = [tx+0.5, ty-0.25];
						baseC = c4;
				   }
				   else if(globalAngleZZ == 180) {
						c1 = [tx, ty+0.5];
						c2 = [tx, ty];
						c3 = [tx, ty-0.5];
						c4 = [tx+0.5, ty+0.5];
						baseC = c3;
				   }
				   else {
						c1 = [tx-0.5, ty-0.25];
						c2 = [tx, ty-0.25];
						c3 = [tx+0.5, ty-0.25];
						c4 = [tx-0.5, ty+0.25];
						baseC = c1;
				   }
				   break;
				
		case('S'): if(globalAngleZZ == 0 || globalAngleZZ == 180) {
						c1 = [tx, ty-0.25];
						c2 = [tx, ty+0.25];
						c3 = [tx-0.5, ty-0.25];
						c4 = [tx+0.5, ty+0.25];
						baseC = c1;
				   }
				   else {
						c1 = [tx+0.5, ty];
						c2 = [tx, ty];
						c3 = [tx+0.5, ty-0.5];
						c4 = [tx, ty+0.5];
						baseC = c3;
				   }
				   break;
				
		case('Z'): if(globalAngleZZ == 0 || globalAngleZZ == 180) {
						c1 = [tx, ty-0.25];
						c2 = [tx, ty+0.25];
						c3 = [tx+0.5, ty-0.25];
						c4 = [tx-0.5, ty+0.25];
						baseC = c1;
				   }
				   else {
						c1 = [tx, ty];
						c2 = [tx+0.5, ty];
						c3 = [tx, ty-0.5];
						c4 = [tx+0.5, ty+0.5];
						baseC = c3;
				   }
				   break;
				
		case('T'): if(globalAngleZZ == 0) {
						c1 = [tx, ty-0.25];
						c2 = [tx-0.5, ty-0.25];
						c3 = [tx+0.5, ty-0.25];
						c4 = [tx, ty+0.25];
						baseC = c1;
				   }
				   else if(globalAngleZZ == 90) {
						c1 = [tx, ty];
						c2 = [tx, ty+0.5];
						c3 = [tx, ty-0.5];
						c4 = [tx+0.5, ty];
						baseC = c3
				   }
				   else if(globalAngleZZ == 180) {
						c1 = [tx, ty+0.25];
						c2 = [tx+0.5, ty+0.25];
						c3 = [tx-0.5, ty+0.25];
						c4 = [tx, ty-0.25];
						baseC = c4;
				   }
				   else {
						c1 = [tx+0.5, ty];
						c2 = [tx+0.5, ty-0.5];
						c3 = [tx+0.5, ty+0.5];
						c4 = [tx, ty];
						baseC = c2;;
				   }
				   break;
	}
}

//----------------------------------------------------------------------------

// Animation --- Updating transformation parameters

var lastTime = 0;
var n = 0;
var speedup = false;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		var elapsed = timeNow - lastTime;
		
		if( (baseC[1] >= tyMin ) && ( n == 48 || speedup ) ) {
			speedup = false;
			ty -= 0.25;
			n = 0;
			
			if(statMatrix.length == 0 && baseC[1] <= tyMin) {
				placeModel();
			}
			else {
				for( var i = 0; i < statMatrix.length; i++) {
					if( checkVC(statMatrix[i][0]) ) {
						placeModel();
					}
				}
			}
		}
		
		// Rotating the light sources
	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}
			if( lightSources[i].isRotXXOn() ) {

				var angle = lightSources[i].getRotAngleXX() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleXX( angle );
			}
		}
	}
	
	n++;
	lastTime = timeNow;
}

function placeModel() {
	statMatrix.push([c1, currentTexture]);
	statMatrix.push([c2, currentTexture]);
	statMatrix.push([c3, currentTexture]);
	statMatrix.push([c4, currentTexture]);
	
	checkLine();
	
	currentModel = null;
	currentTexture = null;
	c1 = [];
	c2 = [];
	c3 = [];
	c4 = [];
	baseC = c1;
	
	ty = 7.5;
	tx = 2.5;
	globalAngleZZ = 0;
}

// ver se linha foi feita

function checkLine() {
	// 14 cubos numa coluna
	var column = 14;
	// 11 cubos numa linha
	var line = 11;
	// cubos existentes na linha (length tem de ser = line para estar completa)
	var cubeInLine = [];
	// numero de linhas a apagar
	var nLines = 0;
	
	// ver todas as colunas
	for(var c = 0; c <= column/2; c+=0.5) {
		// ver todos os cubos
		for(var j = 0; j < statMatrix.length; j++) {
			// se o cubo esta na mesma linha 
			if(statMatrix[j][0][1] == c) cubeInLine.push(statMatrix[j]);
		}
		
		if(cubeInLine.length == line) {
			score++;
			for(var n in statMatrix) {
				// apagar cubos dos estaticos
				for(var k in cubeInLine) {
					var index = statMatrix.indexOf(cubeInLine[k]);
					if( index != -1) statMatrix.splice(index, 1);
				}
				
				//cubos acima descem
				if (statMatrix[n][0][1] > c ) statMatrix[n][0][1] -= 0.5;
			}
			
			// ver a nova linha
			c-=0.5;
		}
		cubeInLine = [];
	}
}

function checkVerticalCollision(limits, c) {
	x = c[0];
	y = c[1];
	if( y <= tyMin)
		return true;
	
	if ( (x == limits[0] || x-0.25 == limits[0] || x+0.25 == limits[0]) && (y == limits[1]+0.5 || y <= tyMin) )
		return true;
	
	return false;
}

function checkRightCollision(limits, c) {
	x = c[0];
	y = c[1];
	if( x+0.5 == limits[0] && (y == limits[1] || y+0.25 == limits[1] || y-0.25 == limits[1] ) ) {
		return true;
	}
	
	return false;
}

function checkLeftCollision(limits, c) {
	x = c[0];
	y = c[1];
	if( x-0.5 == limits[0] && (y == limits[1] || y+0.25 == limits[1] || y-0.25 == limits[1] ) ) {
		return true;
	}
	
	return false;
}

function checkVC(limits) {
	return (checkVerticalCollision(limits, c1) || checkVerticalCollision(limits, c2) || checkVerticalCollision(limits, c3) || checkVerticalCollision(limits, c4));
}

function checkRC(limits) {
	return (checkRightCollision(limits, c1) || checkRightCollision(limits, c2) || checkRightCollision(limits, c3) || checkRightCollision(limits, c4));
}

function checkLC(limits) {
	return (checkLeftCollision(limits, c1) || checkLeftCollision(limits, c2) || checkLeftCollision(limits, c3) || checkLeftCollision(limits, c4));
}

function checkRBorder() {
	return (c1[0] < 5 && c2[0] < 5 && c3[0] < 5 && c4[0] < 5);
}

function checkLBorder() {
	return (c1[0] > 0 && c2[0] > 0 && c3[0] > 0 && c4[0] > 0);
}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

var possibleR = true;
var possibleL = true;
var possible = true;

function handleKeys() {
	
	if (currentlyPressedKeys[39]) {
		// Right arrow key
		// mover para a direita
		
		possibleR = true;
		
		for( var i = 0; i < statMatrix.length; i++) {
		if ( checkRC(statMatrix[i][0]) ) {
				possibleR = false;
			}
		}
		
		if(possibleR && n % 8 == 0 && checkRBorder()) {
			tx += 0.5;
		}
	}
		
	if (currentlyPressedKeys[37]) {
		// Left arrow key
		// mover para a esquerda
		
		possibleL = true;
		
		for( var i = 0; i < statMatrix.length; i++) {
			if ( checkLC(statMatrix[i][0]) ) {
				possibleL = false;
			}
		}
		
		if( possibleL && n % 8 == 0 && checkLBorder() ) {
			tx -= 0.5;
		}
	}
		
	if (currentlyPressedKeys[40]) {
		// Down arrow key
		// acelerar
		
		if( n % 2 == 0 ) 
			speedup = true;
		
	}
		
	if (currentlyPressedKeys[38]) {
		// Up arrow key
		// rodar (nao pode ser rodada junto a borda)
		
		possible = true;
		
		for( var i = 0; i < statMatrix.length; i++) {
			if( checkLC(statMatrix[i][0]) || checkRC(statMatrix[i][0]) ) {
				possible = false;
			}
		}
		
		if ( possible && n % 7 == 0 && checkLBorder() && checkRBorder() ) {
			globalAngleZZ += 90;
			if( globalAngleZZ == 360) globalAngleZZ = 0;
		}
		
	}
}

//----------------------------------------------------------------------------

// Timer

function tick() {
	
	if(!gameOver()) {
		requestAnimFrame(tick);
		
		handleKeys();
		
		animate();
	}
	else {
		console.log("Game over!");
		console.log("Score: " + score);
	}
		
		drawScene();
}

//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
		
}

//----------------------------------------------------------------------------

function setEventListeners(){
	function handleKeyDown(event) {
		
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
		
        currentlyPressedKeys[event.keyCode] = false;
    }

	document.onkeydown = handleKeyDown;
    
    document.onkeyup = handleKeyUp;
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		gl.enable( gl.DEPTH_TEST );
		
		primitiveType = gl.TRIANGLES;
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffers();
	
	initTexture();
	
	tick();

	outputInfos();
}


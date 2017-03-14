import { Matrix4 } from '../math/Matrix4';
import { _Math } from '../math/Math';
import { PerspectiveCamera } from './PerspectiveCamera';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function StereoCamera() {

	this.type = 'StereoCamera';

	this.aspect = 1;

	this.eyeSep = 0.064;

	this.cameraL = new PerspectiveCamera();
	this.cameraL.layers.enable( 1 );
	this.cameraL.matrixAutoUpdate = false;

	this.cameraR = new PerspectiveCamera();
	this.cameraR.layers.enable( 2 );
	this.cameraR.matrixAutoUpdate = false;

	this.baseProjectionMatrix;
	this.baseMatrixWorld;
	this.baseFocus;
	this.baseFov;
	this.baseAspect;
	this.baseNear;
	this.baseFar;
	this.baseZoom;
}

Object.assign( StereoCamera.prototype, {
	setPerEyeViewOffset: function (xOffset, yOffset) {
		var eyeRight = new Matrix4();
		var eyeLeft = new Matrix4();

		var projectionMatrix = this.baseProjectionMatrix.clone();
		var eyeSep = this.eyeSep / 2;
		var eyeSepOnProjection = eyeSep * this.near / this.focus;
		var ymax = ( this.near * Math.tan( _Math.DEG2RAD * this.fov * 0.5 ) ) / this.zoom;
		var xmin, xmax;
		var aspect = this.baseAspect * this.aspect;

		// translate xOffset

		eyeLeft.elements[ 12 ] = - eyeSep;

		//eyeLeft.elements[ 12 ] = - eyeSep + xOffset;
		//eyeLeft.elements[ 13 ] = yOffset;
		// for left eye

		xmin = - ymax * aspect + eyeSepOnProjection;
		xmax = ymax * aspect + eyeSepOnProjection;

		projectionMatrix.elements[ 0 ] = 2 * this.near / ( xmax - xmin );
		projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

		this.cameraL.projectionMatrix.copy( projectionMatrix );
		this.cameraL.matrixWorld.copy( 	this.baseMatrixWorld ).multiply( eyeLeft );
	},
	
	update: ( function () {

		var instance, focus, fov, aspect, near, far, zoom;

		var eyeRight = new Matrix4();
		var eyeLeft = new Matrix4();

		return function update( camera, xOffset, yOffset) {
			xOffset = xOffset || 0;
			yOffset = yOffset || 0;

			var needsUpdate = instance !== this || focus !== camera.focus || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far || zoom !== camera.zoom || camera.projectionMatrix !== this.baseProjectionMatrix || camera.matrixWorld !== this.baseMatrixWorld;

			if ( needsUpdate ) {

				instance = this;
				focus = camera.focus;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;
				zoom = camera.zoom;

				//copy properties to object
				this.baseProjectionMatrix = camera.projectionMatrix.clone();
				this.baseMatrixWorld = camera.matrixWorld.clone();
				this.baseFocus = camera.focus;
				this.baseFov = camera.fov;
				this.baseAspect = camera.aspect;
				this.baseNear = camera.near;
				this.baseFar = camera.far;
				this.baseZoom = camera.zoom;
				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				var projectionMatrix = camera.projectionMatrix.clone();
				var eyeSep = this.eyeSep / 2;
				var eyeSepOnProjection = eyeSep * near / focus;
				var ymax = ( near * Math.tan( _Math.DEG2RAD * fov * 0.5 ) ) / zoom;
				var height = 2 * ymax
				var xmin, xmax, ymin;
				ymax -= yOffset * height;
				ymin = -0.5 * height
				// translate xOffset

				eyeLeft.elements[ 12 ] = - eyeSep;
				eyeRight.elements[ 12 ] = eyeSep;

				// for left eye

				xmin = - ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;
				xmin += xOffset * (xmax - xmin);

				projectionMatrix.elements[5] = 2 * near / (ymax - ymin);
				projectionMatrix.elements[9] = (ymax + ymin) / (ymax - ymin);

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = - ymax * aspect - eyeSepOnProjection + xOffset * (xmax - xmin);
				xmax = ymax * aspect - eyeSepOnProjection;
				xmin += xOffset * (xmax - xmin);

				projectionMatrix.elements[5] = 2 * near / (ymax - ymin);
				projectionMatrix.elements[9] = (ymax + ymin) / (ymax - ymin);

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraR.projectionMatrix.copy( projectionMatrix );

			}

			this.cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
			this.cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );

		};

	} )()

} );


export { StereoCamera };

import { Matrix4 } from '../math/Matrix4.js';
import { _Math } from '../math/Math.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';

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

}

Object.assign( StereoCamera.prototype, {

	update: ( function () {

		var instance, focus, fov, aspect, near, far, zoom, eyeSep;

		var eyeRight = new Matrix4();
		var eyeLeft = new Matrix4();

		return function update( camera, offsetX, offsetY ) {

			offsetX = offsetX || 0;
			offsetY = offsetY || 0;

			var needsUpdate = instance !== this || focus !== camera.focus || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far || zoom !== camera.zoom || eyeSep !== this.eyeSep ||
												camera.projectionMatrix !== this.baseProjectionMatrix ||
												camera.matrixWorld !== this.baseMatrixWorld;;

			if ( needsUpdate ) {

				instance = this;
				focus = camera.focus;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;
				zoom = camera.zoom;

				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				var projectionMatrix = camera.projectionMatrix.clone();
				eyeSep = this.eyeSep / 2;
				var eyeSepOnProjection = eyeSep * near / focus;
				var ymax = ( near * Math.tan( _Math.DEG2RAD * fov * 0.5 ) ) / zoom;
				var xmin, xmax, ymin;
				var height = 2 * ymax;
				ymax -= offsetY * height;
				ymin = -0.5 * height

				// translate xOffset

				eyeLeft.elements[ 12 ] = - eyeSep;
				eyeRight.elements[ 12 ] = eyeSep;

				// for left eye

				xmin = - ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;
				xmin += offsetX * ( xmax - xmin );

				projectionMatrix.elements[ 5 ] = 2 * near / ( ymax - ymin );
				projectionMatrix.elements[ 9 ] = ( ymax + ymin ) / ( ymax - ymin );

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = - ymax * aspect - eyeSepOnProjection + offsetX * ( xmax - xmin );
				xmax = ymax * aspect - eyeSepOnProjection;
				xmin += offsetX * ( xmax - xmin );

				projectionMatrix.elements[ 5 ] = 2 * near / ( ymax - ymin );
				projectionMatrix.elements[ 9 ] = ( ymax + ymin ) / ( ymax - ymin );

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

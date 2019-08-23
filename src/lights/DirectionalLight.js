import { Light } from './Light.js';
import { DirectionalLightShadow } from './DirectionalLightShadow.js';
import { Object3D } from '../core/Object3D.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function DirectionalLight( color, intensity ) {

	Light.call( this, color, intensity );

	this.type = 'DirectionalLight';

	this.position.copy( Object3D.DefaultUp );
	this.updateMatrix();

	this.target = new Object3D();

	this.shadow = new DirectionalLightShadow();
	this.shadowCascade = [new DirectionalLightShadow(), new DirectionalLightShadow(), new DirectionalLightShadow()];

}

DirectionalLight.prototype = Object.assign( Object.create( Light.prototype ), {

	constructor: DirectionalLight,

	isDirectionalLight: true,

	updateCascades: function ( cameraFrusta, sceneBoundingBox ) {

		// Update our shadow camera frustum to fit the viewing frustum

		var shadowCascade = this.shadowCascade;

		cameraFrusta.forEach( function ( cameraFrustumVerts, index ) {

			var transformedBox = sceneBoundingBox.clone();
			var min = null;
			var max = null;
			shadowCascade[index].camera.updateMatrixWorld()
			var inv = new THREE.Matrix4().getInverse(shadowCascade[index].camera.matrixWorld);
			cameraFrustumVerts.map( function ( frustumVert ) {
				frustumVert.applyMatrix4(inv);
				if (min) {
					min.min(frustumVert);
					min.min(frustumVert);
					max.max(frustumVert);
					max.max(frustumVert);
				} else {
					min = new THREE.Vector2(frustumVert.x, frustumVert.y);
					max = new THREE.Vector2(frustumVert.x, frustumVert.y);
				}
			});
			// We limit our shadow cam to fit the scene or to the calculated frustum, whichever is a tighter bound.
			transformedBox.applyMatrix4(inv);
			min.max(transformedBox.min);
			max.min(transformedBox.max);

			// Perform rounding to reduce shimmer
			var unitsPerTexel = new THREE.Vector2().subVectors(max, min);
			unitsPerTexel.divideScalar(shadowCascade[index].mapSize.width);

			min.divide(unitsPerTexel);
			min.floor();
			min.multiply(unitsPerTexel);

			max.divide(unitsPerTexel);
			max.floor();
			max.multiply(unitsPerTexel);

			// Update frusta for real
			shadowCascade[index].camera.left = min.x;
			shadowCascade[index].camera.bottom = min.y;
			shadowCascade[index].camera.right = max.x;
			shadowCascade[index].camera.top = max.y;
			shadowCascade[index].camera.far = Math.max(0, -transformedBox.min.z);
			shadowCascade[index].camera.updateProjectionMatrix();

		});

		this.shadow = this.shadowCascade[2];

	},

	copy: function ( source ) {

		Light.prototype.copy.call( this, source );

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		var cloneFunction = function (element) {
			return element.clone()
		}

		this.shadowCascade = source.shadowCascade.map(cloneFunction);

		return this;

	}

} );


export { DirectionalLight };

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
		cameraFrusta.map( _.bind( function ( cameraFrustumVerts, index ) {
			var transformedBox = sceneBoundingBox.clone();
			var min = null;
			var max = null;
			this.shadowCascade[index].camera.updateMatrixWorld()
			var inv = new THREE.Matrix4().getInverse(this.shadowCascade[index].camera.matrixWorld);
			cameraFrustumVerts.map( function ( frustumVert ) {
				frustumVert.applyMatrix4(inv);
				if (min) {
					min.x = Math.min(frustumVert.x, min.x);
					min.y = Math.min(frustumVert.y, min.y);
					max.x = Math.max(frustumVert.x, max.x);
					max.y = Math.max(frustumVert.y, max.y);
				} else {
					min = new THREE.Vector2(frustumVert.x, frustumVert.y);
					max = new THREE.Vector2(frustumVert.x, frustumVert.y);
				}
			});

			// We limit our shadow cam to fit the scene or to the calculated frustum, whichever is a tighter bound.
			transformedBox.applyMatrix4(inv);
			this.shadowCascade[index].camera.left = Math.max(min.x, transformedBox.min.x);
			this.shadowCascade[index].camera.bottom = Math.max(min.y, transformedBox.min.y);
			this.shadowCascade[index].camera.right = Math.min(max.x, transformedBox.max.x);
			this.shadowCascade[index].camera.top = Math.min(max.y, transformedBox.max.y);

			this.shadowCascade[index].camera.far = Math.max(0, -transformedBox.min.z);
			this.shadowCascade[index].camera.updateProjectionMatrix();
		}, this));
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

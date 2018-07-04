/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  color: <THREE.Color>
 *
 *  zNear: <float>,
 *  zFar: <float>,
 * }
 */

import { Material } from './Material.js';
import { Color } from '../math/Color.js';

function ShadowMaterial( parameters ) {

	Material.call( this );

	this.type = 'ShadowMaterial';

	this.color = new Color( 0x000000 );
	this.transparent = true;

	this.zNear = 0.1;
	this.zFar = 10000;

	this.setValues( parameters );

}

ShadowMaterial.prototype = Object.create( Material.prototype );
ShadowMaterial.prototype.constructor = ShadowMaterial;

ShadowMaterial.prototype.isShadowMaterial = true;

ShadowMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.zNear = source.zNear;
	this.zFar = source.zFar;

	return this;

};


export { ShadowMaterial };

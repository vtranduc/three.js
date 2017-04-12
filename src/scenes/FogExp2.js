import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function FogExp2 ( color, density, distanceNear, distanceFar, heightNear, heightFar ) {

	this.name = '';

	this.color = new Color( color );
	this.density = ( density !== undefined ) ? density : 1;

	this.distanceNear = ( distanceNear !== undefined ) ? distanceNear : 1;
	this.distanceFar = ( distanceFar !== undefined ) ? distanceFar : 1000;
	this.heightNear = ( heightNear !== undefined ) ? heightNear : 1;
	this.heightFar = ( heightFar !== undefined ) ? heightFar : 1000;

}

FogExp2.prototype.isFogExp2 = true;

FogExp2.prototype.clone = function () {

	return new FogExp2( this.color.getHex(), this.density, this.distanceNear, this.distanceFar, this.heightNear, this.heightFar );

};

FogExp2.prototype.toJSON = function ( meta ) {

	return {
		type: 'FogExp2',
		color: this.color.getHex(),
		density: this.density,
		distanceNear: this.distanceNear,
		distanceFar: this.distanceFar,
		heightNear: this.heightNear,
		heightFar: this.heightFar
	};

};

export { FogExp2 };

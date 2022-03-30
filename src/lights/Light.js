import { Object3D } from '../core/Object3D.js';
import { Color } from '../math/Color.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function Light( color, intensity ) {

	Object3D.call( this );

	this.type = 'Light';

	this.color = new Color( color );
	this.intensity = intensity !== undefined ? intensity : 1;

	this.receiveShadow = undefined;

	this.isDynamicLight = true;

}

Light.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Light,

	isLight: true,

	copy: function ( source, recursive ) {

		Object3D.prototype.copy.call( this, source, recursive );

		this.color.copy( source.color );
		this.intensity = source.intensity;

		this.isDynamicLight = source.isDynamicLight;

		return this;

	},

	toJSON: function ( meta ) {

		var data = Object3D.prototype.toJSON.call( this, meta );

		data.object.color = this.color.getHex();
		data.object.intensity = this.intensity;

		if ( this.groundColor !== undefined ) data.object.groundColor = this.groundColor.getHex();

		if ( this.distance !== undefined ) data.object.distance = this.distance;
		if ( this.angle !== undefined ) data.object.angle = this.angle;
		if ( this.decay !== undefined ) data.object.decay = this.decay;
		if ( this.penumbra !== undefined ) data.object.penumbra = this.penumbra;

		if ( this.shadow !== undefined ) data.object.shadow = this.shadow.toJSON();

		if ( this.isDynamicLight !== undefined ) data.object.isDynamicLight = this.isDynamicLight;

		return data;

	}

} );


export { Light };

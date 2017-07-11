import { Matrix4 } from '../math/Matrix4';
import { FloatType, RGBAFormat } from '../constants';
import { DataTexture } from '../textures/DataTexture';
import { _Math } from '../math/Math';
import { Bone } from './Bone';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

function Skeleton( bones, boneInverses ) {

	// copy the bone array

	bones = bones || [];

	this.bones = bones.slice( 0 );
	this.boneMatrices = new Float32Array( this.bones.length * 16 );

	// use the supplied bone inverses or calculate the inverses

	if ( boneInverses === undefined ) {

		this.calculateInverses();

	} else {

		if ( this.bones.length === boneInverses.length ) {

			this.boneInverses = boneInverses.slice( 0 );

		} else {

			console.warn( 'THREE.Skeleton boneInverses is the wrong length.' );

			this.boneInverses = [];

			for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

				this.boneInverses.push( new Matrix4() );

			}

		}

	}

}

Object.assign( Skeleton.prototype, {

	calculateInverses: function () {

		this.boneInverses = [];

		for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

			var inverse = new Matrix4();

			if ( this.bones[ i ] ) {

				inverse.getInverse( this.bones[ i ].matrixWorld );

			}

			this.boneInverses.push( inverse );

		}

	},

	pose: function () {

		var bone, i, il;

		// recover the bind-time world matrices

		for ( i = 0, il = this.bones.length; i < il; i ++ ) {

			bone = this.bones[ i ];

			if ( bone ) {

				bone.matrixWorld.getInverse( this.boneInverses[ i ] );

			}

		}

		// compute the local matrices, positions, rotations and scales

		for ( i = 0, il = this.bones.length; i < il; i ++ ) {

			bone = this.bones[ i ];

			if ( bone ) {

				if ( bone.parent && bone.parent.isBone ) {

					bone.matrix.getInverse( bone.parent.matrixWorld );
					bone.matrix.multiply( bone.matrixWorld );

				} else {

					bone.matrix.copy( bone.matrixWorld );

				}

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

			}

		}

	},

	update: ( function () {

		var offsetMatrix = new Matrix4();
		var identityMatrix = new Matrix4();

		return function update() {

			var bones = this.bones;
			var boneInverses = this.boneInverses;
			var boneMatrices = this.boneMatrices;
			var boneTexture = this.boneTexture;

			// flatten bone matrices to array

			for ( var i = 0, il = bones.length; i < il; i ++ ) {

				// compute the offset between the current and the original transform

				var matrix = bones[ i ] ? bones[ i ].matrixWorld : identityMatrix;

				offsetMatrix.multiplyMatrices( matrix, boneInverses[ i ] );
				offsetMatrix.toArray( boneMatrices, i * 16 );

			}

			if ( boneTexture !== undefined ) {

				boneTexture.needsUpdate = true;

			}

		};

	} )(),

	clone: function () {

		return new Skeleton( this.bones, this.boneInverses );

	},

	toJSON: function ( meta ) {

		var data = {};

		var scope = this;

		function getParentIndex ( bone ) {

			if ( ! bone.parent instanceof Bone ) return -1;

			for ( var i = 0, il = scope.bones.length; i < il; i ++ ) {

				if ( scope.bones[ i ] === bone.parent ) return i;

			}

			return -1;

		}

		var bones = [];
		var sockets = [];

		for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

			var bone = this.bones[ i ];

			bones.push( {

				name: bone.name,
				parent: getParentIndex( bone ),
				pos: bone.position.toArray(),
				rotq: bone.quaternion.toArray(),
				scl: bone.scale.toArray(),
				uuid: bone.uuid

			} );

			for ( var j = 0, jl = bone.children.length; j < jl; j ++ ) {

				var child = bone.children[ j ];

				if ( ! ( child instanceof Bone ) /* || bone.skin !== child.skin */ ) {

					var object = child.toJSON( meta ).object;
					object.parent = bone.uuid;
					sockets.push( object );

				}

			}

		}

		var boneInverses = [];

		for ( var i = 0, il = this.boneInverses.length; i < il; i ++ ) {

			boneInverses.push( this.boneInverses[ i ].toArray() );

		}

		data.uuid = this.uuid;
		data.bones = bones;
		data.boneInverses = boneInverses;
		data.useVertexTexture = this.useVertexTexture;
		if ( sockets.length > 0 ) data.sockets = sockets;

		return data;

	}

} );


export { Skeleton };

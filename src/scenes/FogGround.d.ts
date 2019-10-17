import { Color } from './../math/Color';
import { IFog } from './Fog';

/**
 * This class contains the parameters that define ground fog
 */
export class GroundFog implements IFog {

	constructor( hex: number | string, opacity?: number, distanceEnabled?: boolean, distanceNear?: number, distanceFar?: number, heightEnabled?: boolean, heightNear?: number, heightFar?: number );

	name: string;

	/**
	 * Fog color.
	 */
	color: Color;

	/**
	 * Fog opacity.
	 */
	opacity: number;

  /**
	 * Flag that determines if distance affects fog.
	 */
	distanceEnabled: boolean;

  /**
	 * Objects that are less than 'distanceNear' units from the active camera won't be affected by fog.
   * Default is 0.
	 */
	distanceNear: number;

  /**
   * Objects that are more than 'distanceFar' units away from the active camera will be completely obscured by fog.
   * Default is 100.
	 */
	distanceFar: number;

  /**
	 * Flag that determines if height affects fog.
	 */
	heightEnabled: boolean;

  /**
	 * Objects that are lower than 'heightNear' units in world space will be completely obscured by fog.
   * Default is 0.
	 */
	heightNear: number;

  /**
   * Objects that are higher than 'heightFar' units in world space won't be affected by fog.
   * Default is 100.
	 */
	heightFar: number;

	clone(): this;
	toJSON(): any;

}

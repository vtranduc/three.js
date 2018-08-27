export default /* glsl */`
#if defined( RE_IndirectDiffuse )

	#ifdef USE_INDIRECT_LIGHTMAP

		vec3 lightMapIrradiance = texture2D( indirectLightMap, vUv2 ).xyz * indirectLightMapIntensity;

		#ifndef PHYSICALLY_CORRECT_LIGHTS

			lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage

		#endif

		irradiance += lightMapIrradiance;

	#endif

	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )

		irradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, maxMipLevel );

	#endif

#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )

	radiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry.viewDir, geometry.normal, Material_BlinnShininessExponent( material ), maxMipLevel );

	#ifdef CLEARCOAT

		clearcoatRadiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry.viewDir, geometry.clearcoatNormal, Material_Clearcoat_BlinnShininessExponent( material ), maxMipLevel );

	#endif

#endif
`;

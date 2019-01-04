export default /* glsl */`
uniform bool enableProjection;
uniform float projectionSharpness;
uniform mat3 uvTransform;
varying vec3 vProjectionPosition;
varying vec3 vProjectionNormal;

vec4 GetTexelColorFromProjection( sampler2D _map, vec3 _projectionPosition ) {

  // Triplanar projection, in future other types of projections can be added
  // calculate weight for each plane depending on surface normal for blending
  vec3 blending = abs( vProjectionNormal );
  blending = normalize( max( blending, 0.00001 ) );
  blending.x = pow ( blending.x, projectionSharpness );
  blending.y = pow ( blending.y, projectionSharpness );
  blending.z = pow ( blending.z, projectionSharpness );
  float sum = ( blending.x + blending.y + blending.z );
  blending /= vec3( sum, sum, sum );

  // fetch color from texture for each plane
  vec2 xUV = (uvTransform * vec3( _projectionPosition.yz, 1.0 ) ).xy;
  vec2 yUV = (uvTransform * vec3( _projectionPosition.xz, 1.0 ) ).xy;
  vec2 zUV = (uvTransform * vec3( _projectionPosition.xy, 1.0 ) ).xy;
  vec4 xTexel = texture2D( _map, xUV );
  vec4 yTexel = texture2D( _map, yUV );
  vec4 zTexel = texture2D( _map, zUV );

  // texel blending from all three planes
  return blending.x * xTexel + blending.y * yTexel + blending.z * zTexel;

}
`;

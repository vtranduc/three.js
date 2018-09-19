uniform bool enableProjection;
uniform float projectionSharpness;
uniform mat3 uvTransform;
varying vec3 vProjectionPosition;
varying vec3 vProjectionNormal;

vec4 GetTexelColorFromProjection( sampler2D _map, vec3 _projectionPosition ) {

  // Triplanar projection, in future other types of projections can be added
  // calculate weight for each plane depending on surface normal for blending
  vec3 weightVec = abs( normalize( vProjectionNormal ) );
  weightVec.x = pow( weightVec.x, projectionSharpness );
  weightVec.y = pow( weightVec.y, projectionSharpness );
  weightVec.z = pow( weightVec.z, projectionSharpness );
  float weightSum = max( weightVec.x + weightVec.y + weightVec.z, 0.00001 );
  weightVec /= weightSum;

  // fetch color from texture for each plane
  vec2 mapXuv = ( uvTransform * vec3( fract( abs( _projectionPosition.y ) ), fract( abs( _projectionPosition.z ) ), 1.0 ) ).xy;
  vec2 mapYuv = ( uvTransform * vec3( fract( abs( _projectionPosition.x ) ), fract( abs( _projectionPosition.z ) ), 1.0 ) ).xy;
  vec2 mapZuv = ( uvTransform * vec3( fract( abs( _projectionPosition.x ) ), fract( abs( _projectionPosition.y ) ), 1.0 ) ).xy;

  vec4 mapXtexel = texture2D( _map, mapXuv );
  vec4 mapYtexel = texture2D( _map, mapYuv );
  vec4 mapZtexel = texture2D( _map, mapZuv );

  // texel blending from all three planes
  return weightVec.x * mapXtexel + weightVec.y * mapYtexel + weightVec.z * mapZtexel;

}

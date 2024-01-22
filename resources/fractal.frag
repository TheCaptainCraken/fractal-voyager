#version 330

#define STEP_SIZE 0.1
#define MAX_NUMBER_OF_STEPS 500
#define MINIMUM_HIT_DISTANCE 0.0002
#define MAXIMUM_TRACE_DISTANCE 1000.0

uniform vec2 resolution;
uniform float time;
uniform vec3 player_position;
uniform vec3 light_position;

// This function returns the signed distance between a point in 3d space and the surface of a sphere.
float sphere_SDF(vec3 point, vec3 center, float radius) {
    return length(point - center) - radius;
}

float mandelbulb_sdf(vec3 pos) {
    float mandelbulb_power = 8.0 + sin(time) * 0.3;
    const int mandelbulb_iter_num = 8;

    vec3 z = pos;
    float dr = 1.0;
    float r = 0.0;
    for (int i = 0; i < mandelbulb_iter_num; i++)
    {
        r = length(z);
        if (r > 1.5) break;

        // convert to polar coordinates
        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);

        dr = pow(r, mandelbulb_power - 1.0) * mandelbulb_power * dr + 1.0;

        // scale and rotate the point
        float zr = pow(r, mandelbulb_power);
        theta = theta * mandelbulb_power;
        phi = phi * mandelbulb_power;

        // convert back to cartesian coordinates
        z = pos + zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
    }
    return 0.5 * log(r) * r / dr;
}

float world_SDF(vec3 point) {
    return mandelbulb_sdf(point);
}

vec3 approximate_normal(vec3 point) {
    return normalize(vec3(
            world_SDF(point + vec3(0.001, 0.0, 0.0)) - world_SDF(point - vec3(0.001, 0.0, 0.0)),
            world_SDF(point + vec3(0.0, 0.001, 0.0)) - world_SDF(point - vec3(0.0, 0.001, 0.0)),
            world_SDF(point + vec3(0.0, 0.0, 0.001)) - world_SDF(point - vec3(0.0, 0.0, 0.001))
        ));
}

vec3 ray_march(vec3 ray_origin, vec3 ray_direction) {
    float total_distance_travelled = 0.0;

    for(int i = 0; i < MAX_NUMBER_OF_STEPS; i++) {
        vec3 current_position = ray_origin + ray_direction * total_distance_travelled;

        float distance_to_closest_obj = world_SDF(current_position);

        if (distance_to_closest_obj < MINIMUM_HIT_DISTANCE) {
            vec3 normal = approximate_normal(current_position);

            vec3 light_direction = normalize(current_position - light_position);

            float diffuse_intensity = max(0.0, dot(normal, light_direction));

            return normalize(vec3(233, 196, 106)) * diffuse_intensity;
        }

        if (total_distance_travelled > MAXIMUM_TRACE_DISTANCE)
            break;

        total_distance_travelled += distance_to_closest_obj;
    }
    return normalize(vec3(38, 70, 83));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

    vec3 ray_origin = player_position;
    vec3 ray_direction = vec3(uv, 1.0);

    vec3 color = ray_march(ray_origin, ray_direction);

    gl_FragColor = vec4(color, 1.0);
}

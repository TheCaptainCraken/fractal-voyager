#include <raylib.h>
#include <stdlib.h>

#define SCREEN_WIDTH 1280
#define SCREEN_HEGIHT 900

#define SHADER_NAME "resources/trippy_image.frag"

int main(void) {
  InitWindow(SCREEN_WIDTH, SCREEN_HEGIHT, "Fractal Voyager");

  Image blank_image = GenImageColor(SCREEN_WIDTH, SCREEN_HEGIHT, BLANK);
  Texture2D texture = LoadTextureFromImage(blank_image);
  UnloadImage(blank_image);

  Shader shader = LoadShader(NULL, SHADER_NAME);

  int shader_resolution_location = GetShaderLocation(shader, "resolution");
  float resolution[2] = {(float)SCREEN_WIDTH, (float)SCREEN_HEGIHT};
  SetShaderValue(shader, shader_resolution_location, resolution,
                 SHADER_UNIFORM_VEC2);

  int shader_time_location = GetShaderLocation(shader, "time");
  float time = 0.0;

  SetTargetFPS(60);

  while (!WindowShouldClose()) {

    time = (float)GetTime();
    SetShaderValue(shader, shader_time_location, &time, SHADER_UNIFORM_FLOAT);

    BeginDrawing();
    ClearBackground(RAYWHITE);

    BeginShaderMode(shader);

    DrawTexture(texture, 0, 0, WHITE);

    EndShaderMode();

    EndDrawing();
  }

  UnloadTexture(texture);
  UnloadShader(shader);
  CloseWindow();
  return 0;
}

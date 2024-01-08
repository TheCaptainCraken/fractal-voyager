#include <raylib.h>
#include <stdlib.h>

#define SCREEN_WIDTH 1280
#define SCREEN_HEGIHT 900

#define SHADER_NAME "resources/solid_color.frag"

int main(void) {
  InitWindow(SCREEN_WIDTH, SCREEN_HEGIHT, "Fractal Voyager");

  Image blank_image = GenImageColor(SCREEN_WIDTH, SCREEN_HEGIHT, BLANK);
  Texture2D texture = LoadTextureFromImage(blank_image);
  UnloadImage(blank_image);

  Shader shader = LoadShader(NULL, SHADER_NAME);

  SetTargetFPS(60);

  while (!WindowShouldClose()) {
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

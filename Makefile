RAYLIB_LIBS := -lraylib -lGL -lm -lpthread -ldl -lrt -lX11
CFLAGS := -Wall -Wextra
APP_NAME := fractal-voyager
SRC := src/*.c

default: debug


debug:
	mkdir -p build/debug
	cc $(SRC) -o build/debug/$(APP_NAME) $(CFLAGS) $(RAYLIB_LIBS) -g

release:
	mkdir -p build/release
	cc $(SRC) -o build/release/$(APP_NAME) $(CFLAGS) $(RAYLIB_LIBS) -O2 


clean:
	rm -r build

.PHONY: clean

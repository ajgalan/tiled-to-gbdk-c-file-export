# Tiled to GBDK C File export
This is a extension/export plugin for the [Tiled map editor](https://www.mapeditor.org/) that adds the following type to the "Export As" menu:

* GBDK C file (*.c, *.h)

This save option generates a tile array from the first Tile Layer found that can be used with GBDK's background and window functions such as set_bkg_tiles or set_win_tiles.

<sub>* Blank tiles are defaulted to 0x00</sub>

This extension is based on [Tiled to GBA export](https://github.com/djedditt/tiled-to-gba-export).

## Installation
This extension requires Tiled 1.4 or newer. Get the latest version [here](https://www.mapeditor.org/).

To add this extension to your Tiled installation:
* Open Tiled and go to Edit > Preferences > Plugins and click the "Open" button to open the extensions directory.
* Download [tiled-to-gbdk-c-file-export.js](https://raw.githubusercontent.com/ajgalan/tiled-to-gbdk-c-file-export/main/tiled-to-gbdk-c-file-export.js) in this repository and copy it to that location. The script can be placed either directly in the extensions directory or in a subdirectory.

## Output
The export plugin generates a .c source file and associated .h header file.

**example.h**

```C
#ifndef __example_h_INCLUDE
#define __example_h_INCLUDE

#define exampleWidth 64
#define exampleHeight 64

extern const unsigned char example[];

#endif
```

**example.c**

```C
#include "example.h"

const unsigned char example[] = {
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
    0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13,
    0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
    etc.
};
```

## License
This work is licensed under the MIT License. See [LICENSE](https://raw.githubusercontent.com/ajgalan/tiled-to-gbdk-c-file-export/main/LICENSE) for details.

/*
 * tiled-to-gbdk-c-file-export.js
 *
 * This extension adds the "GBDK C file" type to the "Export As" menu,
 * which generates a tile array that can be used with GBDK's background and
 * window functions such as set_bkg_tiles or set_win_tiles.
 * 
 * This extension is based on "Tiled to GBA export" by Jay van Hutten
 * https://github.com/djedditt/tiled-to-gba-export
 *
 * The first tile layer found is converted to a C array of hexadecimal tile
 * IDs casted into an unsigned 8 bit integer. Blank tiles are defaulted to 0x00.
 *
 * Copyright (c) 2020 Jay van Hutten
 * Copyright (c) 2022 Adrián Jiménez Galán
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

var tiledToGbdkCFileExport = {
    name: "GBDK C file",
    extension: "c *.h",
    write:

    function(p_map, p_fileName) {
        console.time("Export completed in");

        // Split full filename path into the filename (without extension) and the directory
        let fileBaseName = FileInfo.completeBaseName(p_fileName).replace(/[^a-zA-Z0-9-_]/g, "_");
        let filePath = FileInfo.path(p_fileName) + "/";
        
        // Replace the ‘/’ characters in the file path for ‘\’ on Windows
        filePath = FileInfo.toNativeSeparators(filePath);

        //Generate header file data
        let headerFileData = "";
        headerFileData += "#ifndef __" + fileBaseName + "_h_INCLUDE\n";
        headerFileData += "#define __" + fileBaseName + "_h_INCLUDE\n\n";
        headerFileData += "#define " + fileBaseName +"Width " + p_map.width + "\n";
        headerFileData += "#define " + fileBaseName + "Height " + p_map.height + "\n\n";

        headerFileData += "extern const unsigned char "+ fileBaseName + "[];\n\n";
        headerFileData += "#endif\n";

        //Generate tilemap file data
        let tilemapFileData = "";
        tilemapFileData += "#include \"" + fileBaseName + ".h\"\n\n";
        tilemapFileData += "const unsigned char " + fileBaseName + "[] = {";

        //Find first tile layer
        let tileLayerIndex = -1;
        let currentLayer;

        for (let i = 0; i < p_map.layerCount; ++i) {
            currentLayer = p_map.layerAt(i);
            if (currentLayer.isTileLayer) {
                tileLayerIndex  = i;
                break;
            }
        }
        //If no tile layer is found, throw error.
        if (tileLayerIndex == -1) {
            return "Export failed: No Tile Layer found."
        }

        let i = 0;

        for (let y = 0; y < currentLayer.height; y++) {
            for (let x = 0; x < currentLayer.width; x++) {
                let currentTile = currentLayer.cellAt(x, y);
                
                //Write a line break each 10 tiles
                if (i++ % 10 == 0) {
                    tilemapFileData += "\n    ";
                }                

                //If not defined, write tile 0
                if (currentTile.tileId == "-1") {
                    tilemapFileData += "0x00, ";
                } else {
                    //Cast number id into an unsigned 8 bit integer
                    let tileId = currentTile.tileId % 256;
                    
                    //Write tileId as hexadecimal
                    let value = '0x' + tileId.toString(16).padStart(2, "0");          
                    tilemapFileData += value + ", ";
                }
            }
        }

        // Remove the last comma and close the array.
        tilemapFileData = tilemapFileData.slice(0, -2)+"\n};\n";

        // Write header data to disk
        let headerFile = new TextFile(filePath + fileBaseName + ".h", TextFile.WriteOnly);
        headerFile.write(headerFileData);
        headerFile.commit();
        console.log("Header file exported to " + filePath+fileBaseName + ".h");

        // Write source data to disk
        let tilemapFile = new TextFile(filePath + fileBaseName + ".c", TextFile.WriteOnly);
        tilemapFile.write(tilemapFileData);
        tilemapFile.commit();
        console.log("Tilemap file exported to " + filePath + fileBaseName + ".c");

        console.timeEnd("Export completed in");
    }
}

tiled.registerMapFormat("TiledToGbdkCFileExport", tiledToGbdkCFileExport)

console.log("Parsease");

fs = require('fs');

filename = 'fries.ase';

header = {};
layers = [];
frames = [];
chunks = [];

chunk_types = {
    0x0004: "old_pallete_1",
    0x0011: "old_pallete_2",
    0x2004: "layer",
    0x2005: "cel",
    0x2016: "mask",
    0x2017: "path",
    0x2018: "frame_tags",
    0x2019: "pallete"
}

chunk_loaders = {
    "old_pallete_1": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "old_pallete_2": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "layer": function(chunk, get) {
        


        get.skip(chunk.size - 6);
    },
    "cel": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "mask": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "path": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "frame_tags": function(chunk, get) {
        get.skip(chunk.size - 6);
    },
    "pallete"  : function(chunk, get) {
        get.skip(chunk.size - 6);
    }
}



fs.open(filename, 'r', function(status, fd) {
    if(status) {
        console.log("Status:");
        console.log(status.message);
	return;
    }
    var stats = fs.fstatSync(fd);
    var buffer = new Buffer(stats.size);
    
    var bl = fs.readSync(fd, buffer, 0, stats.size);

    console.log("Bytes leidos: " + bl);
    off = 0;
    console.log("Leyendo header:");


    get = {
        dword: function() {
            var r = buffer.readUInt32LE(off);
            off+=4;
            return r;
        },
        word: function() {
            var r = buffer.readUInt16LE(off);
            off+=2;
            return r;
        },
        byte: function() {
            var r = buffer.readUInt8(off);
            off+=1;
            return r;
        },
        skip: function(n) {
            off += n;
        }
    }

    header.filesize = get.dword();
    header.magicnum = get.word();
    header.frames = get.word();
    header.width = get.word();
    header.height = get.word();
    header.colordepth = get.word();
    header.flags = get.dword();
    header._speed = get.word();
    header._ = get.dword();
    header._ = get.dword();
    header.transparent_index = get.byte();
    header._ = get.byte();
    header._ = get.byte();
    header._ = get.byte();
    header.colors = get.word();
    get.skip(94);

    console.log(header);

    console.log("Parseando frames");

    console.log(buffer.length)

    while(off < buffer.length) {
        console.log("Parseando frame nro " + (frames.length+1));
        var frame = {};

        frame.bytes = get.dword();
        frame.magicnum = get.word();
        frame.chunkcount = get.word();
        frame.duration = get.word();
        frame.chunks = [];
        get.skip(6);

        console.log(frame);

        var c = 0;
        console.log("Parseando chunks");
        while(c < frame.chunkcount) {
            console.log("Parseando chunk nro " + (c+1));
            var chunk = {};
            chunk.size = get.dword();
            chunk.type = get.word();
            chunk.typename = chunk_types[chunk.type];

            chunk_loaders[chunk.typename](chunk, get);

            console.log(chunk);
            frame.chunks.push(chunk);

            c++;
        }
        console.log("No hay mas chunks, frame terminado");
        frames.push(frame);
    }

    console.log("No hay mas frames");
});

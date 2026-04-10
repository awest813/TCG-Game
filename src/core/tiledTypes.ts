export interface TiledLayer {
    name: string;
    type: "tilelayer" | "objectgroup";
    data?: number[];
    objects?: TiledObject[];
    width?: number;
    height?: number;
    visible: boolean;
    opacity: number;
}

export interface TiledObject {
    id: number;
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties?: { name: string; value: string | number | boolean }[];
}

export interface TiledTileset {
    firstgid: number;
    name: string;
    tilewidth: number;
    tileheight: number;
    columns: number;
    image: string;
    imageheight: number;
    imagewidth: number;
}

export interface TiledMapJSON {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    layers: TiledLayer[];
    tilesets: TiledTileset[];
}

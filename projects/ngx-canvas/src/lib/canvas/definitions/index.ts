export * from './canvas';
export * from './plane';

export enum DrawingMode {
    PEN = 'pen',
    ERASER = 'eraser',
    DELETE = 'delete',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
}

export interface PlaneCreateConfig {
    index: number;
    visible: boolean;
    backgroundColor?: string;
}

export interface PlaneDescription extends PlaneCreateConfig {
    // id: number;
    width: number;
    height: number;
    /**
     * @deprecated: Instead use the `backgroundColor` directly
     */
    isBackground: boolean;
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface DrawPoint {
    nextCoordinates: Coordinate[];
    mode: DrawingMode;
    color: string;
}

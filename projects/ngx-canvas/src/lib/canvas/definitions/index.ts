export * from './canvas';
export * from './plane';

export enum DrawingMode {
    PEN = 'pen',
    ERASER = 'eraser',
    DELETE = 'delete',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
}

export interface PlaneDescription {
    // id: number;
    width: number;
    height: number;
    visible: boolean;
    index: number;
    /**
     * @deprecated: Instead use the `backgroundColor` directly
     */
    isBackground: boolean;
    backgroundColor?: string;
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

import { PointerHandler } from '../../../core/pointer-handler';

export class LeftPointerHandler implements PointerHandler {
    public constructor() {}

    public onPointerDown(event: PointerEvent): void {
        throw new Error('Method not implemented.');
    }
    public onPointerMove(event: PointerEvent): void {
        throw new Error('Method not implemented.');
    }
    public onPointerUp(event: PointerEvent): void {
        throw new Error('Method not implemented.');
    }
}

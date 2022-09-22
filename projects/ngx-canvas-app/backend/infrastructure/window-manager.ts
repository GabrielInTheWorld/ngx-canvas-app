import { BrowserWindow } from 'electron';

export class WindowManager {
    private static readonly _windows: { [id: number]: BrowserWindow } = {};

    private constructor() {}

    public static getWindow(windowId: number): BrowserWindow {
        return this._windows[windowId];
    }

    public static getAllWindows(): BrowserWindow[] {
        return Object.values(this._windows);
    }

    public static addWindow(window: BrowserWindow): void {
        this._windows[window.id] = window;
    }

    public static removeWindow(id: number): void {
        delete this._windows[id];
    }
}

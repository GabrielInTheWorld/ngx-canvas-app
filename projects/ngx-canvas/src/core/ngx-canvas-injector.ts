import { Injector, ProviderToken } from '@angular/core';
export class NgxCanvasInjector {
    private static _injector: Injector;

    public static setInjector(injector: Injector): void {
        this._injector = injector;
    }

    public static get<T>(token: ProviderToken<T>, defaultValue?: any): T {
        return this._injector.get(token, defaultValue);
    }
}

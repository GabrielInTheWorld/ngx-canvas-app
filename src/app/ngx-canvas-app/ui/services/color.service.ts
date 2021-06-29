import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Color = string;

const DEFAULT_COLOR = '#000';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    public readonly colorSubject = new BehaviorSubject<Color>(DEFAULT_COLOR);

    public get currentColor(): Color {
        return this.colorSubject.value;
    }
}

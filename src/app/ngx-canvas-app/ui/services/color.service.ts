import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_COLOR = '#000';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public readonly colorSubject = new BehaviorSubject<string>(DEFAULT_COLOR);

  public get currentColor(): string {
    return this.colorSubject.value;
  }
}

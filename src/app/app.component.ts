import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'canvas-app';

    public fps = 0;

    private currentLoop = new Date();

    public constructor() {
        requestAnimationFrame(() => this.calculateFps());
    }

    private calculateFps(): void {
        const nextLoop = new Date();
        this.fps = Math.round(1000 / (+nextLoop - +this.currentLoop));
        this.currentLoop = nextLoop;
        requestAnimationFrame(() => this.calculateFps());
    }
}

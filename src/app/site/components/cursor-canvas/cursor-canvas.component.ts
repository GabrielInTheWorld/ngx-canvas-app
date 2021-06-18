import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-cursor-canvas',
  templateUrl: './cursor-canvas.component.html',
  styleUrls: ['./cursor-canvas.component.scss'],
})
export class CursorCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('cursorCanvas')
  public cursorCanvas: ElementRef<HTMLCanvasElement> | null = null;

  constructor() {}

  ngOnInit(): void {}

  public ngAfterViewInit(): void {
    console.log('cursorCanvas:', this.cursorCanvas);
  }
}

import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'sierpinski-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="dot" [ngStyle]="style" [style.background-color]="bgColor" (mouseenter)="enter()" (mouseleave)="leave()">
        {{hover ? '*' + text + '*' : text}}
      </div>
  `,
})
export class SierpinskiDot implements OnInit {
  bgColor: string;
  style: any;
  hover: boolean = false;

  @Input() x: number;
  @Input() y: number;
  @Input() size: number;
  @Input() text: string;

  enter() {
    this.hover = true;
    this.bgColor = '#ff0';
  }

  leave() {
    this.hover = false;
    this.bgColor = undefined;
  }

  ngOnInit() {
    const s = this.size * 1.3;
    this.style = {
      width: s + 'px',
      height: s + 'px',
      left: (this.x) + 'px',
      top: (this.y) + 'px',
      borderRadius: (s / 2) + 'px',
      lineHeight: (s) + 'px',
    };
  }
}

@Component({
  selector: 'sierpinski-triangle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template [ngIf]="s < targetSize">
      <sierpinski-dot [x]="x - targetSize / 2" [y]="y - targetSize / 2" [size]="targetSize" [text]="text"></sierpinski-dot>
    </ng-template>
    <ng-template [ngIf]="s > targetSize">
      <sierpinski-triangle [x]="x" [y]="y - s / 4" [s]="s / 2" [text]="text"></sierpinski-triangle>
      <sierpinski-triangle [x]="x - s / 2" [y]="y + s / 4" [s]="s / 2" [text]="text"></sierpinski-triangle>
      <sierpinski-triangle [x]="x + s / 2" [y]="y + s / 4" [s]="s / 2" [text]="text"></sierpinski-triangle>
    </ng-template>
  `
})
export class SierpinskiTriangle {
  targetSize = 25;
  @Input() x: number;
  @Input() y: number;
  @Input() s: number;
  @Input() text: string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="cnt" [style.transform]="transform">
      <sierpinski-triangle [x]="0" [y]="0" [s]="1000" [text]="seconds"></sierpinski-triangle>
    </div>
  `,
})
export class AppComponent implements OnInit,
    OnDestroy {
  intervalCleanup: any;
  rAFCleanup: any;
  start = new Date().getTime();

  seconds = 0;
  transform: SafeStyle;

  constructor(private _sanitizer: DomSanitizer) {}

  updateScale() {
    const elapsed = new Date().getTime() - this.start;
    const t = (elapsed / 1000) % 10;
    const scale = 1 + (t > 5 ? 10 - t : t) / 10;
    this.transform = this._sanitizer.bypassSecurityTrustStyle(
        `scaleX(${scale / 2.1}) scaleY(0.7) translateZ(0.1px)`);
    this.rAFCleanup = requestAnimationFrame(() => { this.updateScale(); });
  }

  updateSeconds() { this.seconds = (this.seconds % 10) + 1; }

  ngOnInit() {
    this.updateScale();
    this.intervalCleanup = setInterval(() => { this.updateSeconds(); }, 1000);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rAFCleanup);
    clearInterval(this.intervalCleanup);
  }
}

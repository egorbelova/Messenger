// interface GradientCache {
//   canvas: HTMLCanvasElement | null;
//   shadow: number | null;
//   colors: string | null;
// }

// interface PatternCache {
//   canvas: HTMLCanvasElement;
//   scale: number;
//   quality: number;
// }

// class StaticBackgroundFixedZoom {
//   private gradientCanvas: HTMLCanvasElement;
//   private patternCanvas: HTMLCanvasElement;
//   private gradientCtx: CanvasRenderingContext2D;
//   private patternCtx: CanvasRenderingContext2D;
//   private patternImage: HTMLImageElement;

//   private FIXED_HEX_1: string;
//   private FIXED_HEX_2: string;
//   private FIXED_HEX_3: string;
//   private FIXED_SHADOW: number;
//   private FIXED_SCALE: number = 2;

//   private RENDER_QUALITY: number = 1;
//   private PATTERN_QUALITY: number = 2;

//   private gradientCache: GradientCache = {
//     canvas: null,
//     shadow: null,
//     colors: null,
//   };

//   private patternCache: PatternCache | null = null;

//   private resizeTimeout: number | null = null;
//   private redrawTimeout: number | null = null;

//   constructor() {
//     const gradientCanvas = document.getElementById(
//       'gradient-canvas'
//     ) as HTMLCanvasElement;
//     const patternCanvas = document.getElementById(
//       'pattern-canvas'
//     ) as HTMLCanvasElement;

//     if (!gradientCanvas || !patternCanvas) {
//       throw new Error('Required canvas elements not found');
//     }

//     this.gradientCanvas = gradientCanvas;
//     this.patternCanvas = patternCanvas;

//     const gradientCtx = this.gradientCanvas.getContext('2d');
//     const patternCtx = this.patternCanvas.getContext('2d');

//     if (!gradientCtx || !patternCtx) {
//       throw new Error('Could not get canvas context');
//     }

//     this.gradientCtx = gradientCtx;
//     this.patternCtx = patternCtx;

//     this.patternImage = new Image();

//     // Initialize colors and shadow from cookies or defaults
//     const room_BG_color_hex = this.getCookie('room_BG_color_hex') || '#4d8ddb';

//     let shadow_degree = parseInt(this.getCookie('room_BG_shadow') || '45');
//     if (isNaN(shadow_degree)) {
//       shadow_degree = 45;
//       this.setCookie('room_BG_shadow', '45', 7);
//     }

//     if (!this.getCookie('room_BG_color_hex')) {
//       this.setCookie('room_BG_color_hex', '#4d8ddb', 7);
//     }

//     // Initialize fixed colors
//     this.FIXED_HEX_1 = this.pSBC(-0.6, room_BG_color_hex);
//     this.FIXED_HEX_2 = this.pSBC(0, room_BG_color_hex);
//     this.FIXED_HEX_3 = this.pSBC(-0.8, room_BG_color_hex);
//     this.FIXED_SHADOW = shadow_degree;

//     this.init();
//   }

//   private setupEventListeners(): void {
//     const shadowInput = document.querySelector(
//       '#shadow_degree_chat'
//     ) as HTMLInputElement;
//     const colorInput = document.querySelector(
//       '#color_chat_change'
//     ) as HTMLInputElement;

//     if (!shadowInput || !colorInput) {
//       console.warn('Color or shadow input elements not found');
//       return;
//     }

//     let shadowTimeout: number;
//     // shadowInput.oninput = (e: Event) => {
//     //   clearTimeout(shadowTimeout);
//     //   shadowTimeout = window.setTimeout(() => {
//     //     this.FIXED_SHADOW = parseInt(shadowInput.value) || 45;
//     //     this.setCookie('room_BG_shadow', this.FIXED_SHADOW.toString(), 7);
//     //     document.documentElement.style.setProperty(
//     //       '--shadow_degree',
//     //       `${this.FIXED_SHADOW}deg`
//     //     );

//     //     this.drawGradient();
//     //     this.drawPatternMask();
//     //   }, 16);
//     // };

//     let colorTimeout: number;
//     // colorInput.oninput = (e: Event) => {
//     //   clearTimeout(colorTimeout);
//     //   colorTimeout = window.setTimeout(() => {
//     //     const newColor = colorInput.value;
//     //     this.setCookie('room_BG_color_hex', newColor, 7);

//     //     this.FIXED_HEX_1 = this.pSBC(-0.6, newColor);
//     //     this.FIXED_HEX_2 = this.pSBC(0, newColor);
//     //     this.FIXED_HEX_3 = this.pSBC(-0.8, newColor);

//     //     this.gradientCache.canvas = null;
//     //     this.patternCache = null;
//     //     this.drawGradient();
//     //     this.drawPatternMask();
//     //   }, 16);
//     // };
//   }

//   private async init(): Promise<void> {
//     this.patternImage.src = '/SVG/PATTERNS/pattern-29.svg';
//     this.patternImage.setAttribute('preserveAspectRatio', 'none');

//     await new Promise<void>((resolve) => {
//       this.patternImage.onload = () => {
//         this.createPatternCache();
//         resolve();
//       };
//       this.patternImage.onerror = () => {
//         console.error('Failed to load pattern image');
//         resolve();
//       };
//     });

//     this.setupEventListeners();
//     this.resize();

//     window.addEventListener('resize', () => {
//       if (this.resizeTimeout) {
//         clearTimeout(this.resizeTimeout);
//       }
//       this.resizeTimeout = window.setTimeout(() => this.resize(), 100);
//     });

//     window.addEventListener('orientationchange', () => {
//       setTimeout(() => this.resize(), 150);
//     });
//   }

//   private createPatternCache(): void {
//     const baseSize = 400 * this.FIXED_SCALE * this.PATTERN_QUALITY;
//     const cacheCanvas = document.createElement('canvas');
//     const cacheCtx = cacheCanvas.getContext('2d');

//     if (!cacheCtx) {
//       throw new Error('Could not create cache canvas context');
//     }

//     cacheCanvas.width = baseSize;
//     cacheCanvas.height = baseSize;

//     cacheCtx.imageSmoothingEnabled = true;
//     cacheCtx.imageSmoothingQuality = 'medium';

//     cacheCtx.drawImage(this.patternImage, 0, 0, baseSize, baseSize);

//     this.patternCache = {
//       canvas: cacheCanvas,
//       scale: this.FIXED_SCALE,
//       quality: this.PATTERN_QUALITY,
//     };
//   }

//   private resize(): void {
//     const mainChatWindow = document.querySelector('.chat-container');
//     if (!mainChatWindow) {
//       console.warn('Main chat window not found');
//       return;
//     }

//     const width = mainChatWindow.clientWidth;
//     const height = mainChatWindow.clientHeight;

//     const scaleFactor = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;

//     [this.gradientCanvas, this.patternCanvas].forEach((canvas) => {
//       canvas.style.width = `${width}px`;
//       canvas.style.height = `${height}px`;

//       canvas.width = Math.floor(width * scaleFactor);
//       canvas.height = Math.floor(height * scaleFactor);

//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
//         ctx.imageSmoothingEnabled = true;
//         ctx.imageSmoothingQuality = 'medium';
//       }
//     });

//     this.drawGradient();
//     this.drawPatternMask();
//   }

//   private drawGradient(): void {
//     const cacheKey = `${this.FIXED_SHADOW}_${this.FIXED_HEX_1}_${this.FIXED_HEX_2}_${this.FIXED_HEX_3}`;

//     if (
//       this.gradientCache.canvas &&
//       this.gradientCache.shadow === this.FIXED_SHADOW &&
//       this.gradientCache.colors === cacheKey
//     ) {
//       const width = parseFloat(this.gradientCanvas.style.width);
//       const height = parseFloat(this.gradientCanvas.style.height);

//       this.gradientCtx.clearRect(0, 0, width, height);
//       this.gradientCtx.drawImage(
//         this.gradientCache.canvas,
//         0,
//         0,
//         width,
//         height
//       );
//       return;
//     }

//     const width = parseFloat(this.gradientCanvas.style.width);
//     const height = parseFloat(this.gradientCanvas.style.height);

//     const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
//     this.gradientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

//     this.gradientCtx.clearRect(0, 0, width, height);

//     const gradient = this.gradientCtx.createLinearGradient(
//       0,
//       0,
//       Math.cos((this.FIXED_SHADOW * Math.PI) / 180) * width,
//       Math.sin((this.FIXED_SHADOW * Math.PI) / 180) * height
//     );

//     gradient.addColorStop(0, this.FIXED_HEX_1);
//     gradient.addColorStop(0.35, this.FIXED_HEX_2);
//     gradient.addColorStop(1, this.FIXED_HEX_3);

//     this.gradientCtx.fillStyle = gradient;
//     this.gradientCtx.fillRect(0, 0, width, height);

//     this.cacheGradient(width, height, cacheKey);
//   }

//   private cacheGradient(width: number, height: number, cacheKey: string): void {
//     const cacheCanvas = document.createElement('canvas');
//     const cacheCtx = cacheCanvas.getContext('2d');

//     if (!cacheCtx) {
//       return;
//     }

//     cacheCanvas.width = width;
//     cacheCanvas.height = height;

//     const gradient = cacheCtx.createLinearGradient(
//       0,
//       0,
//       Math.cos((this.FIXED_SHADOW * Math.PI) / 180) * width,
//       Math.sin((this.FIXED_SHADOW * Math.PI) / 180) * height
//     );

//     gradient.addColorStop(0, this.FIXED_HEX_1);
//     gradient.addColorStop(0.35, this.FIXED_HEX_2);
//     gradient.addColorStop(1, this.FIXED_HEX_3);

//     cacheCtx.fillStyle = gradient;
//     cacheCtx.fillRect(0, 0, width, height);

//     this.gradientCache = {
//       canvas: cacheCanvas,
//       shadow: this.FIXED_SHADOW,
//       colors: cacheKey,
//     };
//   }

//   private drawPatternMask(): void {
//     const width = parseFloat(this.patternCanvas.style.width);
//     const height = parseFloat(this.patternCanvas.style.height);

//     this.patternCtx.setTransform(1, 0, 0, 1, 0, 0);
//     this.patternCtx.clearRect(
//       0,
//       0,
//       this.patternCanvas.width,
//       this.patternCanvas.height
//     );

//     const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
//     this.patternCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

//     this.patternCtx.imageSmoothingEnabled = true;
//     this.patternCtx.imageSmoothingQuality = 'medium';
//     this.patternCtx.globalCompositeOperation = 'source-over';

//     const scale = this.FIXED_SCALE;
//     const patternSize = 400 * scale;
//     const patternWidth = patternSize / (2960 / 1440);
//     const patternHeight = patternSize;

//     const cols = Math.ceil(width / patternWidth) + 1;
//     const rows = Math.ceil(height / patternHeight) + 1;

//     for (let x = 0; x < cols; x++) {
//       for (let y = 0; y < rows; y++) {
//         const posX = x * patternWidth;
//         const posY = y * patternHeight;

//         if (this.patternCache?.canvas) {
//           this.patternCtx.drawImage(
//             this.patternCache.canvas,
//             posX,
//             posY,
//             patternWidth,
//             patternHeight
//           );
//         } else {
//           this.patternCtx.drawImage(
//             this.patternImage,
//             posX,
//             posY,
//             patternWidth,
//             patternHeight
//           );
//         }
//       }
//     }

//     this.applyMask();
//   }

//   private applyMask(): void {
//     this.gradientCtx.setTransform(1, 0, 0, 1, 0, 0);
//     this.gradientCtx.imageSmoothingEnabled = true;
//     this.gradientCtx.imageSmoothingQuality = 'medium';

//     this.gradientCtx.globalCompositeOperation = 'destination-in';
//     this.gradientCtx.drawImage(this.patternCanvas, 0, 0);

//     const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
//     this.gradientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     this.gradientCtx.globalCompositeOperation = 'source-over';
//   }

//   private getCookie(name: string): string | null {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop()?.split(';').shift() || null;
//     }
//     return null;
//   }

//   private setCookie(name: string, value: string, days: number): void {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     const expires = `expires=${date.toUTCString()}`;
//     document.cookie = `${name}=${value};${expires};path=/`;
//   }

//   private pSBC(amount: number, color: string): string {
//     return color;
//   }
// }

// export default StaticBackgroundFixedZoom;

import { pSBC } from './pSBC';
import generateGradientColors from './generateGradientColors';

class StaticBackgroundFixedZoom {
  private gradientCanvas: HTMLCanvasElement;
  private patternCanvas: HTMLCanvasElement;

  private gradientCtx: CanvasRenderingContext2D;
  private patternCtx: CanvasRenderingContext2D;

  private patternImage: HTMLImageElement;

  private FIXED_HEX_1: string;
  private FIXED_HEX_2: string;
  private FIXED_HEX_3: string;
  private FIXED_SHADOW: number;
  private FIXED_SCALE: number;

  private RENDER_QUALITY: number;
  private PATTERN_QUALITY: number;

  private container: HTMLElement;

  private gradientCache: {
    canvas: HTMLCanvasElement | null;
    shadow: number | null;
    colors: string | null;
  };

  private patternCache: {
    canvas: HTMLCanvasElement | null;
    scale: number;
    quality: number;
  } | null;

  private resizeTimeout: number | null;
  private redrawTimeout: number | null;

  constructor(
    gradientCanvas: HTMLCanvasElement,
    patternCanvas: HTMLCanvasElement,
    container: HTMLElement
  ) {
    this.gradientCanvas = gradientCanvas;
    this.patternCanvas = patternCanvas;
    this.container = container;

    this.gradientCtx = this.gradientCanvas.getContext('2d')!;
    this.patternCtx = this.patternCanvas.getContext('2d')!;
    this.patternImage = new Image();

    let room_BG_color_hex = '#4d8ddb';
    let shadow_degree = 45;

    let gradientColors: string[] = [];
    if (!Number.isInteger(shadow_degree)) {
      shadow_degree = 45;
    }

    try {
      gradientColors = Array.from(generateGradientColors(room_BG_color_hex));
    } catch (e) {
      room_BG_color_hex = '#6c47ff';
      gradientColors = Array.from(generateGradientColors(room_BG_color_hex));
    }

    this.FIXED_HEX_1 = pSBC(-0.2, room_BG_color_hex);
    this.FIXED_HEX_2 = pSBC(0, room_BG_color_hex);
    this.FIXED_HEX_3 = pSBC(-0.4, room_BG_color_hex);

    this.FIXED_SHADOW = shadow_degree;
    this.FIXED_SCALE = 2;

    this.RENDER_QUALITY = 2;
    this.PATTERN_QUALITY = 2;

    this.gradientCache = {
      canvas: null,
      shadow: null,
      colors: null,
    };

    this.patternCache = null;

    this.resizeTimeout = null;
    this.redrawTimeout = null;

    this.init();
  }

  private setupEventListeners(): void {
    let shadowTimeout: number;
    document
      .querySelector('#shadow_degree_chat')
      ?.addEventListener('input', (e) => {
        clearTimeout(shadowTimeout);
        shadowTimeout = window.setTimeout(() => {
          const input = document.querySelector<HTMLInputElement>(
            '#shadow_degree_chat'
          )!;
          this.FIXED_SHADOW = parseInt(input.value, 10);
          document.documentElement.style.setProperty(
            '--shadow_degree',
            `${this.FIXED_SHADOW}deg`
          );

          this.drawGradient();
          this.drawPatternMask();
        }, 16);
      });

    let colorTimeout: number;
    document
      .querySelector('#color_chat_change')
      ?.addEventListener('input', (e) => {
        clearTimeout(colorTimeout);
        colorTimeout = window.setTimeout(() => {
          const input =
            document.querySelector<HTMLInputElement>('#color_chat_change')!;
          const newColor = input.value;

          this.FIXED_HEX_1 = pSBC(-0.6, newColor);
          this.FIXED_HEX_2 = pSBC(0, newColor);
          this.FIXED_HEX_3 = pSBC(-0.8, newColor);

          this.gradientCache.canvas = null;
          if (this.patternCache) this.patternCache.canvas = null;

          this.drawGradient();
          this.drawPatternMask();
        }, 16);
      });
  }

  private async init(): Promise<void> {
    this.patternImage.src = '/SVG/PATTERNS/pattern-13.svg';
    this.patternImage.setAttribute('preserveAspectRatio', 'none');

    await new Promise<void>((resolve) => {
      this.patternImage.onload = () => {
        this.createPatternCache();
        resolve();
      };
    });

    this.setupEventListeners();
    this.resize();

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(() => this.resize(), 100);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 150);
    });
  }

  private createPatternCache(): void {
    const baseSize = 400 * this.FIXED_SCALE * this.PATTERN_QUALITY;
    const cacheCanvas = document.createElement('canvas');
    const cacheCtx = cacheCanvas.getContext('2d')!;

    cacheCanvas.width = baseSize;
    cacheCanvas.height = baseSize;

    cacheCtx.imageSmoothingEnabled = true;
    cacheCtx.imageSmoothingQuality = 'medium';

    cacheCtx.drawImage(this.patternImage, 0, 0, baseSize, baseSize);

    this.patternCache = {
      canvas: cacheCanvas,
      scale: this.FIXED_SCALE,
      quality: this.PATTERN_QUALITY,
    };
  }

  private resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const scaleFactor = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;

    [this.gradientCanvas, this.patternCanvas].forEach((canvas) => {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvas.width = Math.floor(width * scaleFactor);
      canvas.height = Math.floor(height * scaleFactor);

      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    });

    this.drawGradient();
    this.drawPatternMask();
  }

  private drawGradient(): void {
    const cacheKey = `${this.FIXED_SHADOW}_${this.FIXED_HEX_1}_${this.FIXED_HEX_2}_${this.FIXED_HEX_3}`;

    if (
      this.gradientCache.canvas &&
      this.gradientCache.shadow === this.FIXED_SHADOW &&
      this.gradientCache.colors === cacheKey
    ) {
      const ctx = this.gradientCtx;
      const width = parseFloat(this.gradientCanvas.style.width);
      const height = parseFloat(this.gradientCanvas.style.height);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(this.gradientCache.canvas, 0, 0, width, height);
      return;
    }

    const ctx = this.gradientCtx;
    const width = parseFloat(this.gradientCanvas.style.width);
    const height = parseFloat(this.gradientCanvas.style.height);

    const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      Math.cos((this.FIXED_SHADOW * Math.PI) / 180) * width,
      Math.sin((this.FIXED_SHADOW * Math.PI) / 180) * height
    );

    gradient.addColorStop(0, this.FIXED_HEX_1);
    gradient.addColorStop(0.5, this.FIXED_HEX_2);
    gradient.addColorStop(1, this.FIXED_HEX_3);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.cacheGradient(width, height, cacheKey);
  }

  private cacheGradient(width: number, height: number, cacheKey: string): void {
    const cacheCanvas = document.createElement('canvas');
    const cacheCtx = cacheCanvas.getContext('2d')!;

    cacheCanvas.width = width;
    cacheCanvas.height = height;

    const gradient = cacheCtx.createLinearGradient(
      0,
      0,
      Math.cos((this.FIXED_SHADOW * Math.PI) / 180) * width,
      Math.sin((this.FIXED_SHADOW * Math.PI) / 180) * height
    );

    gradient.addColorStop(0, this.FIXED_HEX_1);
    gradient.addColorStop(0.35, this.FIXED_HEX_2);
    gradient.addColorStop(1, this.FIXED_HEX_3);

    cacheCtx.fillStyle = gradient;
    cacheCtx.fillRect(0, 0, width, height);

    this.gradientCache = {
      canvas: cacheCanvas,
      shadow: this.FIXED_SHADOW,
      colors: cacheKey,
    };
  }

  private drawPatternMask(): void {
    const ctx = this.patternCtx;
    const width = parseFloat(this.patternCanvas.style.width);
    const height = parseFloat(this.patternCanvas.style.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);

    const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.globalCompositeOperation = 'source-over';

    const scale = this.FIXED_SCALE;
    const patternSize = 400 * scale;
    const patternWidth = patternSize / (2960 / 1440);
    const patternHeight = patternSize;

    const cols = Math.ceil(width / patternWidth) + 1;
    const rows = Math.ceil(height / patternHeight) + 1;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const posX = x * patternWidth;
        const posY = y * patternHeight;

        if (this.patternCache?.canvas) {
          ctx.drawImage(
            this.patternCache.canvas,
            posX,
            posY,
            patternWidth,
            patternHeight
          );
        } else {
          ctx.drawImage(
            this.patternImage,
            posX,
            posY,
            patternWidth,
            patternHeight
          );
        }
      }
    }

    this.applyMask();
  }

  private applyMask(): void {
    const ctx = this.gradientCtx;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(this.patternCanvas, 0, 0);

    const dpr = (window.devicePixelRatio || 1) * this.RENDER_QUALITY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }
}

export default StaticBackgroundFixedZoom;

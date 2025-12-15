interface TabElements {
  leftMenuFooter: HTMLElement | null;
  leftMenuFooterPadding: HTMLElement | null;
  chatsTab: HTMLElement | null;
  settingsTab: HTMLElement | null;
  indicator: HTMLElement | null;
  settingsMenu: HTMLElement | null;
  chatsMenu: HTMLElement | null;
}

document.addEventListener('DOMContentLoaded', function (): void {
  const elements: TabElements = {
    leftMenuFooter: document.querySelector('.left-menu-footer'),
    leftMenuFooterPadding: document.querySelector('.left-menu-footer-padding'),
    chatsTab: document.querySelector('.left-menu-footer-chats'),
    settingsTab: document.querySelector('.left-menu-footer-settings'),
    indicator: document.querySelector('.tab-indicator'),
    settingsMenu: document.querySelector('.settings_menu'),
    chatsMenu: document.querySelector('.users_search'),
  };

  let startX: number = 0;
  let currentPosition: number = 0;
  let lastPosition: number = 0;
  let lastTime: number = 0;
  let velocity: number = 0;
  let lastVelocity: number = 0;
  let returnTimer: number | null = null;
  let currentBubbleHeight: number = 1.2;

  const NORMAL_BUBBLE_HEIGHT: number = 1.3;
  const MIN_BUBBLE_HEIGHT: number = 1;
  const VELOCITY_THRESHOLD: number = 0.15;
  const VELOCITY_CHANGE_THRESHOLD: number = 0.95;
  const RETURN_DELAY: number = 100;

  type TabType = 'chats' | 'settings';

  function switchTab(activeTab: TabType): void {
    elements.chatsTab?.classList.remove('active');
    elements.settingsTab?.classList.remove('active');

    if (activeTab === 'chats') {
      elements.chatsTab?.classList.add('active');
      elements.indicator?.classList.remove('toggle');
      elements.indicator?.classList.add('toggle2');
      currentPosition = 0;
      updateIndicatorPosition();
      elements.chatsMenu?.classList.add('active');
      elements.settingsMenu?.classList.remove('active');
    } else {
      elements.settingsTab?.classList.add('active');
      elements.indicator?.classList.remove('toggle2');
      elements.indicator?.classList.add('toggle');
      currentPosition = calcMaxTranslate();
      updateIndicatorPosition();
      elements.chatsMenu?.classList.remove('active');
      elements.settingsMenu?.classList.add('active');
    }
  }

  function calcMaxTranslate(): number {
    if (!elements.leftMenuFooter || !elements.indicator) return 0;

    const containerWidth: number = elements.leftMenuFooter.offsetWidth;
    const indicatorWidth: number = elements.indicator.offsetWidth;
    return containerWidth * 1.05 - (indicatorWidth - 5) * 1.2;
  }

  function updateIndicatorPosition(): void {
    if (elements.indicator) {
      elements.indicator.style.translate = `${currentPosition}px 0`;
    }
  }

  function getActiveTabFromPosition(): TabType {
    if (!elements.leftMenuFooter || !elements.indicator) return 'chats';

    const containerWidth: number = elements.leftMenuFooter.offsetWidth;
    const threshold: number = containerWidth / 2;
    const currentPos: number =
      currentPosition + elements.indicator.offsetWidth / 2;
    return currentPos < threshold ? 'chats' : 'settings';
  }

  elements.chatsTab?.addEventListener('touchstart', () => switchTab('chats'), {
    passive: true,
  });
  elements.chatsTab?.addEventListener('mousedown', () => switchTab('chats'));
  elements.settingsTab?.addEventListener(
    'touchstart',
    () => switchTab('settings'),
    {
      passive: true,
    }
  );
  elements.settingsTab?.addEventListener('mousedown', () =>
    switchTab('settings')
  );

  elements.indicator?.addEventListener(
    'touchstart',
    function (e: TouchEvent): void {
      e.preventDefault();
      const touch: Touch = e.touches[0];
      startX = touch.clientX - currentPosition;
      this.classList.add('active');
      elements.leftMenuFooterPadding?.classList.add('active');
      this.style.translate = `${currentPosition}px 0`;
      this.style.transform = `scale(1.2)`;
    },
    { passive: true }
  );

  function tabMove(e: TouchEvent): void {
    e.preventDefault();
    if (!e.touches[0]) return;

    const touch: Touch = e.touches[0];
    const newPosition: number = touch.clientX - startX;
    const maxTranslate: number = calcMaxTranslate();

    currentPosition = Math.max(0, Math.min(newPosition, maxTranslate));

    setTimeout((): void => {
      updateIndicatorPosition();
    }, 100);

    const currentTime: number = Date.now();
    if (lastTime > 0) {
      const deltaTime: number = currentTime - lastTime;
      const deltaPosition: number = Math.abs(newPosition - lastPosition);
      velocity = deltaPosition / deltaTime;
    }
    if (velocity === Infinity) return;

    lastPosition = newPosition;
    lastTime = currentTime;

    if (returnTimer) {
      clearTimeout(returnTimer);
      returnTimer = null;
    }

    let shouldUpdateHeight: boolean = false;

    if (lastVelocity === 0) {
      shouldUpdateHeight = true;
    } else {
      const velocityChange: number = Math.abs(velocity - lastVelocity);
      const relativeChange: number = velocityChange / lastVelocity;
      if (relativeChange > VELOCITY_CHANGE_THRESHOLD) {
        shouldUpdateHeight = true;
      } else if (
        (lastVelocity <= VELOCITY_THRESHOLD && velocity > VELOCITY_THRESHOLD) ||
        (lastVelocity > VELOCITY_THRESHOLD && velocity <= VELOCITY_THRESHOLD)
      ) {
        shouldUpdateHeight = true;
      }
    }

    if (shouldUpdateHeight) {
      let targetBubbleHeight: number = NORMAL_BUBBLE_HEIGHT;

      if (velocity > VELOCITY_THRESHOLD) {
        const speedFactor: number = Math.min(
          1,
          (velocity - VELOCITY_THRESHOLD) / VELOCITY_THRESHOLD
        );
        targetBubbleHeight =
          NORMAL_BUBBLE_HEIGHT -
          (NORMAL_BUBBLE_HEIGHT - MIN_BUBBLE_HEIGHT) * speedFactor;
      }
      currentBubbleHeight = targetBubbleHeight;
      lastVelocity = velocity;
    }

    if (this instanceof HTMLElement) {
      this.style.transform = `scale(1.2, ${currentBubbleHeight})`;
    }
  }

  function returnToNormalHeight(): void {
    if (elements.indicator) {
      elements.indicator.style.transform = `scale(1.2, ${NORMAL_BUBBLE_HEIGHT})`;
    }
    currentBubbleHeight = NORMAL_BUBBLE_HEIGHT;
    velocity = 0;
    lastVelocity = 0;
    lastTime = 0;
  }

  function tabEnd(this: HTMLElement): void {
    this.style.translate = `${currentPosition}px 0`;
    this.style.transform = `scale(1)`;
    this.classList.remove('active');
    elements.leftMenuFooterPadding?.classList.remove('active');
    const activeTab: TabType = getActiveTabFromPosition();
    switchTab(activeTab);
  }

  function throttle<
    T extends (...args: any[]) => void
  >(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>): void {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  elements.indicator?.addEventListener('touchmove', throttle(tabMove, 16), {
    passive: true,
  });
  elements.indicator?.addEventListener('touchend', tabEnd);
  elements.indicator?.addEventListener('touchcancel', tabEnd);

  // switchTab('chats');
});

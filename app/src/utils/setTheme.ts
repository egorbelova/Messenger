// @ts-ignore
import { pSBC } from '../utils/index';
import { CookieManager } from './cookies/CookieManager';

interface ThemeColors {
  message_color: string;
  message_font_color: string;
  darker_: string;
  user_font_color: string;
  textarea_font: string;
  attachment_tabs: string;
  attachment_tabs_font: string;
  // @ts-ignore
  room_BG_color_hex: string;
}

function set_theme(theme_mode?: string): void {
  const currentTheme = theme_mode || CookieManager.get('theme_mode');

  const lightThemeColors: ThemeColors = {
    message_color: '#FFF',
    message_font_color: '#ffffffff',
    darker_: '#FFF',
    user_font_color: '#000',
    textarea_font: '#000',
    attachment_tabs: '#EEE',
    attachment_tabs_font: '#000',
    room_BG_color_hex: CookieManager.get('room_BG_color_hex') || '#4d8ddb',
  };

  const darkThemeColors: ThemeColors = {
    message_color: 'rgba(28,28,28)',
    message_font_color: '#FFF',
    darker_: pSBC(-0.3, CookieManager.get('room_BG_color_hex') || '#4d8ddb'),
    user_font_color: '#FFF',
    textarea_font: '#FFF',
    attachment_tabs: '#1E1E1E',
    attachment_tabs_font: '#FFF',
    room_BG_color_hex: CookieManager.get('room_BG_color_hex') || '#4d8ddb',
  };

  if (currentTheme === 'D') {
    applyLightTheme(lightThemeColors);
  } else if (currentTheme === 'D') {
    applyDarkTheme(darkThemeColors);
  }
}

function applyLightTheme(colors: ThemeColors): void {
  setCSSVariables(colors);

  const elements = getThemeElements();

  if (elements.settings) {
    elements.settings.setAttribute('style', 'background: #EEE;');
  }

  // if (elements.body) {
  //   elements.body.setAttribute('style', 'background-color: #FFF;');
  // }

  // if (elements.opponentTitle) {
  //   elements.opponentTitle.setAttribute(
  //     'style',
  //     'background-color: #FFFFFFE6;'
  //   );
  // }

  if (elements.name) {
    elements.name.setAttribute('style', 'color: #000;');
  }

  if (elements.sendDiv) {
    elements.sendDiv.setAttribute('style', 'background-color: #FFFFFFE6;');
  }
  // @ts-ignore
  if (elements.usersSearch) {
    // @ts-ignore
    elements.usersSearch.setAttribute('style', 'background-color: #FFF;');
  }

  if (elements.searchDiv) {
    elements.searchDiv.setAttribute('style', 'background-color: #FFF;');
  }

  if (elements.attachments) {
    elements.attachments.setAttribute('style', 'background-color: #FFF;');
  }

  if (elements.settingsMenu) {
    elements.settingsMenu.setAttribute('style', 'background-color: #FFF;');
  }

  const darkModeCheck = document.querySelector(
    '#dark_mode_check'
  ) as HTMLInputElement;
  if (darkModeCheck) {
    darkModeCheck.checked = false;
  }
}

function applyDarkTheme(colors: ThemeColors): void {
  setCSSVariables(colors);

  const elements = getThemeElements();

  if (elements.settings) {
    elements.settings.setAttribute('style', 'background: #222;');
  }

  // if (elements.body) {
  //   elements.body.setAttribute('style', 'background-color: #000000;');
  // }

  if (elements.name) {
    elements.name.setAttribute('style', 'color: white;');
  }
  // @ts-ignore
  if (elements.usersSearch) {
    // @ts-ignore
    elements.usersSearch.setAttribute('style', 'background-color: #000000;');
  }

  if (elements.attachments) {
    elements.attachments.setAttribute('style', 'background-color: #000000;');
  }

  if (elements.settingsMenu) {
    elements.settingsMenu.setAttribute('style', 'background-color: #000000;');
  }

  const darkModeCheck = document.querySelector(
    '#dark_mode_check'
  ) as HTMLInputElement;
  if (darkModeCheck) {
    darkModeCheck.checked = true;
  }
}

function setCSSVariables(colors: ThemeColors): void {
  const root = document.documentElement;
  root.style.setProperty('--message_color', colors.message_color);
  root.style.setProperty('--message_font_color', colors.message_font_color);
  root.style.setProperty('--darker_', colors.darker_);
  root.style.setProperty('--user_font_color', colors.user_font_color);
  root.style.setProperty('--textarea_font', colors.textarea_font);
  root.style.setProperty('--attachment_tabs', colors.attachment_tabs);
  root.style.setProperty('--attachment_tabs_font', colors.attachment_tabs_font);

  if (colors.room_BG_color_hex) {
    root.style.setProperty('--room_BG_color_hex', colors.room_BG_color_hex);
  }
}

function getThemeElements() {
  return {
    settings: document.querySelector('.settings') as HTMLElement,
    // body: document.querySelector('body') as HTMLElement,
    // opponentTitle: document.querySelector(
    //   '#opponent_title_name'
    // ) as HTMLElement,
    name: document.querySelector('#name') as HTMLElement,
    sendDiv: document.querySelector('.send_div') as HTMLElement,
    // usersSearch: document.querySelector('.users_search') as HTMLElement,
    searchDiv: document.querySelector('.search_div') as HTMLElement,
    attachments: document.querySelector('.attachments') as HTMLElement,
    settingsMenu: document.querySelector('.settings_menu') as HTMLElement,
  };
}

class ThemeManager {
  private static instance: ThemeManager;

  private constructor() {}

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  setTheme(theme_mode?: string): void {
    const currentTheme = theme_mode || CookieManager.get('theme_mode');
    if (currentTheme === 'D') {
      this.applyLightTheme();
    } else {
      // console.log('dark');
      this.applyDarkTheme();
    }
  }

  private applyLightTheme(): void {
    // @ts-ignore
    const colors: ThemeColors = {
      message_color: '#FFF',
      message_font_color: '#ffffffff',
      darker_: '#FFF',
      user_font_color: '#000',
      textarea_font: '#000',
      attachment_tabs: '#EEE',
      attachment_tabs_font: '#000',
    };

    this.setCSSVariables(colors);
    this.setElementStyles('light');
    this.setDarkModeCheckbox(false);
  }

  private applyDarkTheme(): void {
    const colors: ThemeColors = {
      message_color: 'rgba(28,28,28)',
      message_font_color: '#FFF',
      darker_: pSBC(-0.3, CookieManager.get('room_BG_color_hex') || '#4d8ddb'),
      user_font_color: '#FFF',
      textarea_font: '#FFF',
      attachment_tabs: '#1E1E1E',
      attachment_tabs_font: '#FFF',
      room_BG_color_hex: CookieManager.get('room_BG_color_hex') || '#4d8ddb',
    };

    this.setCSSVariables(colors);
    this.setElementStyles('dark');
    this.setDarkModeCheckbox(true);
  }

  private setCSSVariables(colors: ThemeColors): void {
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  private setElementStyles(theme: 'light' | 'dark'): void {
    const elements = this.getThemeElements();
    const styles = this.getThemeStyles(theme);

    Object.entries(elements).forEach(([key, element]) => {
      if (element && styles[key]) {
        element.setAttribute('style', styles[key]);
      }
    });
  }

  private setDarkModeCheckbox(checked: boolean): void {
    const darkModeCheck = document.querySelector(
      '#dark_mode_check'
    ) as HTMLInputElement;
    if (darkModeCheck) {
      darkModeCheck.checked = checked;
    }
  }

  private getThemeElements() {
    return {
      settings: document.querySelector('.settings') as HTMLElement,
      // body: document.querySelector('body') as HTMLElement,
      // opponentTitle: document.querySelector(
      //   '#opponent_title_name'
      // ) as HTMLElement,
      // name: document.querySelector('#name') as HTMLElement,
      // sendDiv: document.querySelector('.send_div') as HTMLElement,
      // usersSearch: document.querySelector('.users_search') as HTMLElement,
      // searchDiv: document.querySelector('.search_div') as HTMLElement,
      // attachments: document.querySelector('.attachments') as HTMLElement,
      // settingsMenu: document.querySelector('.settings_menu') as HTMLElement,
    };
  }

  private getThemeStyles(theme: 'light' | 'dark'): { [key: string]: string } {
    const lightStyles = {
      settings: 'background: #EEE;',
      // body: 'background-color: #FFF;',
      opponentTitle: 'background-color: #FFFFFFE6;',
      name: 'color: #000;',
      sendDiv: 'background-color: #FFFFFFE6;',
      usersSearch: 'background-color: #FFF;',
      searchDiv: 'background-color: #FFF;',
      attachments: 'background-color: #FFF;',
      settingsMenu: 'background-color: #FFF;',
    };

    const darkStyles = {
      settings: 'background: #222;',
      // body: 'background-color: #000000;',
      opponentTitle: 'background-color: #1E1E1EE6;',
      name: 'color: white;',
      sendDiv: 'background-color: #1E1E1EE6;',
      usersSearch: 'background-color: #000000;',
      searchDiv: 'background-color: #00000099;',
      attachments: 'background-color: #000000;',
      settingsMenu: 'background-color: #000000;',
    };

    return theme === 'light' ? lightStyles : darkStyles;
  }
}

export { set_theme, ThemeManager };

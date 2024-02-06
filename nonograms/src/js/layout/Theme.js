export default class Theme {
  constructor() {
    this.body = document.body;
  }

  changeTheme(e) {
    const icon = e.currentTarget.querySelector('.icon');

    if (this.body.classList.contains('dark-theme')) {
      icon.classList.remove('icon_theme-dark');
      icon.classList.add('icon_theme-light');
    } else {
      icon.classList.remove('icon_theme-light');
      icon.classList.add('icon_theme-dark');
    }

    this.body.classList.toggle('dark-theme');
  }
}

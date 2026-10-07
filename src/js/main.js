/**
 * Theme switcher (Bootstrap 5.3 con persistencia en localStorage)
 *
 * - Tema por defecto: oscuro
 * - Soporta valores: "light", "dark", "auto"
 * - Cambia dinámicamente el atributo `data-bs-theme` en <html>
 * - Actualiza el icono del botón según el tema activo
 * - Mantiene la preferencia del usuario en localStorage
 *
 * @module ThemeSwitcher
 */
(() => {
  /** @constant {string} storageKey - Clave usada en localStorage */
  const storageKey = 'theme';

  /** @type {HTMLElement|null} themeIcon - Elemento <i> que muestra el icono del tema */
  const themeIcon = document.querySelector('.d-theme-icon');

  /**
   * Obtiene el tema almacenado en localStorage
   * @returns {string|null} El valor del tema almacenado o null si no existe
   */
  const getStoredTheme = () => localStorage.getItem(storageKey);

  /**
   * Determina el tema preferido
   * - Si hay uno guardado en localStorage, lo devuelve
   * - Si no, usa "dark" como predeterminado
   *
   * @returns {"light"|"dark"|"auto"} Tema preferido
   */
  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored) return stored;
    return 'dark'; // 👈 por defecto oscuro
  };

  /**
   * Aplica un tema en el documento
   * - Si el tema es "auto", sigue el esquema de color del sistema operativo
   *
   * @param {"light"|"dark"|"auto"} theme - Tema a aplicar
   */
  const setTheme = theme => {
    if (theme === 'auto') {
      document.documentElement.setAttribute(
        'data-bs-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      );
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    updateIcon(theme);
  };

  /**
   * Actualiza el icono en función del tema
   * @param {"light"|"dark"|"auto"} theme - Tema actual
   */
  const updateIcon = theme => {
    if (!themeIcon) return;

    let iconClass = 'bi-circle-half'; // auto
    if (theme === 'light') iconClass = 'bi-sun-fill';
    if (theme === 'dark') iconClass = 'bi-moon-stars-fill';

    themeIcon.className = `bi me-1 d-theme-icon ${iconClass}`;
  };

  // Inicializa el tema con el preferido
  setTheme(getPreferredTheme());

  /**
   * Listener: Cambia el tema si el SO cambia de modo (solo en "auto")
   */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const stored = getStoredTheme();
    if (!stored || stored === 'auto') setTheme(getPreferredTheme());
  });

  /**
   * Listener: Inicializa el comportamiento de los botones del selector de tema
   */
  window.addEventListener('DOMContentLoaded', () => {
    const activeTheme = getPreferredTheme();

    document.querySelectorAll('[data-bs-theme-value]').forEach(btn => {
      // Marca como activo el tema actual
      btn.classList.toggle('active', btn.getAttribute('data-bs-theme-value') === activeTheme);

      // Evento click en cada opción
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-bs-theme-value');
        localStorage.setItem(storageKey, theme);
        setTheme(theme);

        // Actualiza estado activo en todos los botones
        document.querySelectorAll('[data-bs-theme-value]')
          .forEach(el => el.classList.toggle('active', el === btn));
      });
    });
  });
})();

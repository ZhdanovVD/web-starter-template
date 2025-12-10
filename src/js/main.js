// Главный файл JavaScript
console.log('Web Starter Template loaded!');

// Пример модуля
const App = {
  init() {
    this.bindEvents();
    console.log('App initialized');
  },

  bindEvents() {
    // Обработчики событий для кнопок
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', this.handleButtonClick);
    });
  },

  handleButtonClick(e) {
    const buttonText = e.target.textContent;
    console.log(`Button clicked: ${buttonText}`);
    
    // Можно добавить функциональность кнопок
    if (e.target.classList.contains('btn-primary')) {
      alert('Основная кнопка нажата!');
    } else if (e.target.classList.contains('btn-secondary')) {
      alert('Дополнительная кнопка нажата!');
    }
  }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
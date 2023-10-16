const tabsBtn = document.querySelectorAll('.tab-label input');
const tabs = document.querySelectorAll('.game-over-tab');

tabsBtn.forEach((tabBtn) => {
  tabBtn.addEventListener('click', (e) => {

    const activeTab = document.querySelector('.game-over-tab_active');
    const selectedInput = e.target.dataset['tab'];
    const selectedTab = document.querySelector(`.game-over-tab[data-tab="${selectedInput}"]`);

    activeTab.classList.remove('game-over-tab_active');
    selectedTab.classList.add('game-over-tab_active')
  })
})
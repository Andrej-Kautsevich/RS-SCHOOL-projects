const tabsBtn = document.querySelectorAll('.seasons-form__label input');
const tabs = document.querySelectorAll('.favorites__tab');

let fadeIn, fadeOut;

// Switch tabs by click
tabsBtn.forEach((tabBtn) => {
	tabBtn.addEventListener('click', (e) => {

		const activeTab = document.querySelector('.favorites__tab_active');
		const selectedSeason = e.target.dataset['season'];
		const selectedTab = document.querySelector(`.favorites__tab[data-season="${selectedSeason}"]`);

		//Check if an animation is running
		if (fadeIn && fadeIn.playState === "running") {
			tabs.forEach((tab) => {
				tab.removeAttribute('style');
			});
			fadeIn.cancel();
			fadeInTab(selectedTab);
			e.stopPropagation();
		}

		if (fadeOut && fadeOut.playState === "running") {
			fadeOut.oncancel = () => { };
			fadeOut.cancel();
		}

		fadeOutTab(activeTab, () => {
			fadeInTab(selectedTab);
		});
	});
});

// Fade out tab animation
const fadeOutTab = (tab, callback) => {
	const fadeOutKeyFrames = new KeyframeEffect(
		tab,
		[
			{ opacity: 1 },
			{ opacity: 0 },
		],
		{
			duration: 500,
			easing: 'ease-out',
		},
	);
	fadeOut = new Animation(fadeOutKeyFrames);

	fadeOut.onfinish = () => {
		tab.classList.remove('favorites__tab_active');
		if (callback) callback();
	}

	fadeOut.play();
}

// Fade in animation
const fadeInTab = (tab) => {
	tab.style.display = 'flex';

	const fadeInKeyFrames = new KeyframeEffect(
		tab,
		[
			{ opacity: 0 },
			{ opacity: 1 },
		],
		{
			duration: 500,
			easing: 'ease-in',
		},
	);
	fadeIn = new Animation(fadeInKeyFrames);

	fadeIn.onfinish = () => {
		tab.classList.add('favorites__tab_active');
		tab.removeAttribute('style');
	};

	fadeIn.play();
}
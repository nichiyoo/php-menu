document.addEventListener('DOMContentLoaded', function () {
	if (!localStorage.getItem('shifts')) window.location.href = 'index.html';

	const loaded = localStorage.getItem('shifts');
	const { date, shifts } = JSON.parse(loaded);

	document.querySelector('#date').innerHTML = formatDate(new Date(date));
	new SuperMarquee(document.querySelector('.marquee'), {
		content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, aperiam.',
	});

	const [first, ...rest] = shifts;
	let foodInterval = renderFoods(first);
	let shiftInterval = renderShift(rest);

	setInterval(() => {
		clearInterval(foodInterval);
		clearInterval(shiftInterval);

		const temp = shifts.shift();
		shifts.push(temp);

		const [first, ...rest] = shifts;
		foodInterval = renderFoods(first);
		shiftInterval = renderShift(rest);
	}, 15000);
});

const html = String.raw;

/**
 * Format the date to be displayed
 * @param {string} date
 * @returns
 */
const formatDate = (date) => {
	return date.toLocaleDateString('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

/**
 * Render the menu cards
 * @param {htmlElement} foods
 * @param {object} data
 * @returns
 */
const renderFoods = (shift) => {
	const { time, menus } = shift;

	const current = document.getElementById('current');
	current.classList.add('fade-up');
	current.innerHTML = time;

	const foods = document.querySelectorAll('.food');
	if (foods.length === 0) return;

	const change = () => {
		foods.forEach((food, index) => {
			const { image, name } = menus.at(index);

			setTimeout(() => {
				food.innerHTML = html`
					<img src="${image}" alt="food" class="w-full rounded-xl aspect-square object-cover" />
					<div class="space-y-2">
						<h2 class="text-2xl heading">${name}</h2>
						<p class="text-zinc-500 line-clamp-2">
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium, cumque?
						</p>
					</div>
				`;

				food.querySelector('div').classList.add('fade-up');
				food.querySelector('img').classList.add('fade-up');
			}, index * 200);
		});
	};

	change();

	return setInterval(() => {
		const first = menus.shift();
		menus.push(first);
		change();
	}, 5000);
};

/**
 * Render the shift card
 * @param {object} shift
 * @returns
 */
const renderShift = (shifts) => {
	const schedule = document.querySelector('.shift');
	if (!schedule) return;

	let index = 0;

	const change = () => {
		const { time, menus } = shifts.at(index);

		const lists = menus.map((menu) => {
			return html` <li class="px-4 py-2 bg-zinc-100 rounded-xl">${menu.name}</li>`;
		});

		schedule.innerHTML = html`
			<span class="text-2xl font-bold heading">${time}</span>
			<ul class="space-y-4 overflow-hidden">
				${lists.join('')}
			</ul>
		`;

		schedule.querySelector('span').classList.add('fade-up');
		schedule.querySelectorAll('li').forEach((li, index) => {
			setTimeout(() => {
				li.classList.add('fade-up');
			}, index * 200);
		});
	};

	change();

	return setInterval(() => {
		index = (index + 1) % shifts.length;
		change();
	}, 5000);
};

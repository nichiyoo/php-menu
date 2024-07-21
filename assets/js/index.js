document.addEventListener('DOMContentLoaded', function () {
	const form = document.querySelector('form');
	const masks = document.querySelectorAll('.mask');

	masks.forEach((mask) => {
		mask.addEventListener('click', () => {
			const input = mask.querySelector('input');
			const preview = mask.querySelector('.preview');

			input.click();
			input.addEventListener('change', (e) => {
				const file = e.target.files[0];
				const reader = new FileReader();
				reader.addEventListener('load', () => {
					preview.src = reader.result;
					preview.classList.remove('hidden');
				});
				reader.readAsDataURL(file);
			});
		});
	});

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(form);

		const data = {
			date: formData.get('date'),
			message: formData.get('message'),
			shifts: [
				{
					time: formData.get('shift-1'),
					menus: [
						{
							name: formData.get('menu-1'),
							image: fileToBase64(formData.get('image-1')),
							description: formData.get('description-1'),
						},
						{
							name: formData.get('menu-2'),
							image: fileToBase64(formData.get('image-2')),
							description: formData.get('description-2'),
						},
						{
							name: formData.get('menu-3'),
							image: fileToBase64(formData.get('image-3')),
							description: formData.get('description-3'),
						},
					],
				},
				{
					time: formData.get('shift-2'),
					menus: [
						{ name: formData.get('menu-4') },
						{ name: formData.get('menu-5') },
						{ name: formData.get('menu-6') },
					],
				},
				{
					time: formData.get('shift-3'),
					menus: [
						{ name: formData.get('menu-7') },
						{ name: formData.get('menu-8') },
						{ name: formData.get('menu-9') },
					],
				},
			],
		};

		const promises = data.shifts.at(0).menus.map((menu) => menu.image);

		await Promise.all(promises).then((images) => {
			data.shifts.at(0).menus.forEach((menu, i) => {
				menu.image = images[i];
			});
		});

		localStorage.setItem('shifts', JSON.stringify(data));
		window.location.href = 'output.html';
	});
});

/**
 * Convert file to base64
 * @param {File} file
 * @returns base64 string
 */
const fileToBase64 = async (file) => {
	const reader = new FileReader();

	const result = await new Promise((resolve, reject) => {
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

	return result;
};

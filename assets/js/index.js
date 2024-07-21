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

		if (
			[
				'date',
				...Array(3)
					.fill(null)
					.map((_, i) => 'shift-' + Number(i + 1)),
			].some((key) => !formData.get(key) || formData.get(key) === '')
		) {
			alert('Semua field harus diisi');
			return;
		}

		const data = {
			date: formData.get('date') || 'Kosong',
			shifts: Array(3)
				.fill(null)
				.map((_, i) => {
					const time = formData.get('shift-' + Number(i + 1));

					return {
						time: time || 'Kosong',
						menus: Array(3)
							.fill(null)
							.map((_, j) => {
								const index = i * 3 + j + 1;
								const name = formData.get('menu-' + index);
								const image = formData.get('image-' + index);

								if (image.size === 0) {
									return {
										name: name || 'Kosong',
										image: 'https://placehold.co/600x400?text=Tidak+Ada+Gambar',
									};
								}

								return {
									name: name || 'Kosong',
									image: fileToBase64(image),
								};
							}),
					};
				}),
		};

		const promises = data.shifts.flatMap((shift) => shift.menus.map((menu) => menu.image));

		await Promise.all(promises).then((images) => {
			data.shifts.forEach((shift, i) => {
				shift.menus.forEach((menu, j) => {
					menu.image = images[i * 3 + j];
				});
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

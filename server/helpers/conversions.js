const toObjectId = (id) => {
	const ObjectId = (require('mongoose').Types.ObjectId);
	return new ObjectId(id.toString());
};

const findCommon = (str1 = '', str2 = '') => {
	const s1 = [...str1];
	const s2 = [...str2];
	const arr = Array(s2.length + 1).fill(null).map(() => {
		return Array(s1.length + 1).fill(null);
	});
	for (let j = 0; j <= s1.length; j += 1) {
		arr[0][j] = 0;
	}
	for (let i = 0; i <= s2.length; i += 1) {
		arr[i][0] = 0;
	}
	let len = 0;
	let col = 0;
	let row = 0;
	for (let i = 1; i <= s2.length; i += 1) {
		for (let j = 1; j <= s1.length; j += 1) {
			if (s1[j - 1] === s2[i - 1]) {
				arr[i][j] = arr[i - 1][j - 1] + 1;
			}
			else {
				arr[i][j] = 0;
			}
			if (arr[i][j] > len) {
				len = arr[i][j];
				col = j;
				row = i;
			}
		}
	}
	if (len === 0) {
		return '';
	}
	let res = '';
	while (arr[row][col] > 0) {
		res = s1[col - 1] + res;
		row -= 1;
		col -= 1;
	}
	return res;
};

const sortMenuItems = (menuItems, namePart) => {
	if (menuItems.length > 0) {
		const namepartLowercase = namePart.toLowerCase();
		menuItems.sort((a, b) => {
			const aName = a.name.toLowerCase();
			const bName = b.name.toLowerCase();
			const aMatch = findCommon(aName, namepartLowercase);
			const bMatch = findCommon(bName, namepartLowercase);

			return bMatch.length - aMatch.length;
		});

		menuItems.sort((a, b) => {
			const aMatch = findCommon(a.name, namePart);
			const bMatch = findCommon(b.name, namePart);

			return bMatch.length - aMatch.length;
		});
		return menuItems;
	} else {
		return [];
	}
}

const sortMenuItemsMainDishesFirst = (menuItems) => {
	if (menuItems.length) {
		menuItems.sort((a, b) => {
			if (a.isMainDish === !b.isMainDish) {
				if (a.isMainDish) {
					return -1;
				}
				return 1;
			} else {
				return 0;
			}
		});
		return menuItems;
	} else {
		return [];
	}
}

module.exports = {
	toObjectId,
	findCommon,
	sortMenuItems,
	sortMenuItemsMainDishesFirst,
}
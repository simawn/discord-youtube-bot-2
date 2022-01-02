/**
 * A really simple function that shuffles an array.
 */
export default function shuffle(array: any[]) {
	for (let index = array.length - 1; index > 0; index--) {
		const randFromIndex = Math.floor(Math.random() * (index + 1));
		const arrItemByIndex = array[index];
		array[index] = array[randFromIndex];
		array[randFromIndex] = arrItemByIndex;
	}

	return array;
}

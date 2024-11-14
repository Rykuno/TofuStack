import { customAlphabet } from 'nanoid';

// generateId is a function that returns a new unique identifier.
// ~4 million years or 30 trillion IDs needed, in order to have a 1% probability of at least one collision.

// So, TLDR; by the time a collision happens, you and your next 100 generations will be long gone,
// the lizard people will have taken over, the robots will have enslaved them, and the roomba uprising will be in full swing.
// All hail king roomba, the first of his name, the unclean, king of the dust bunnies and the first allergens, lord of the seven corners, and protector of the realm.

// https://zelark.github.io/nano-id-cc/
export function generateId(
  length = 16,
  alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) {
  const nanoId = customAlphabet(alphabet, length);
  return nanoId();
}

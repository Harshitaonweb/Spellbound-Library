const db = require('../config/db');

// Hogwarts-themed name components
const HOGWARTS_FIRST_NAMES = [
  'Harry', 'Hermione', 'Ron', 'Draco', 'Luna', 'Neville', 'Ginny', 'Fred',
  'George', 'Remus', 'Sirius', 'Albus', 'Severus', 'Minerva', 'Rubeus',
  'Dobby', 'Winky', 'Kreacher', 'Bellatrix', 'Narcissa', 'Lucius', 'Tom',
  'Cedric', 'Cho', 'Fleur', 'Viktor', 'Oliver', 'Percy', 'Charlie', 'Bill',
  'Molly', 'Arthur', 'James', 'Lily', 'Mundungus', 'Kingsley', 'Nymphadora',
  'Alastor', 'Gellert', 'Newt', 'Tina', 'Queenie', 'Jacob', 'Credence'
];

const HOGWARTS_TITLES = [
  'Seeker', 'Keeper', 'Chaser', 'Beater', 'Auror', 'Prefect', 'Headmaster',
  'Professor', 'DeathEater', 'Order', 'Marauder', 'Animagus', 'Metamorphmagus',
  'Parseltongue', 'Occlumens', 'Legilimens', 'Wandmaker', 'Potioneer',
  'Magizoologist', 'Healer', 'Quidditch', 'Wizengamot', 'Unspeakable'
];

/**
 * Generate a random Hogwarts-themed username
 * Format: FirstName_Title_Number or FirstName_Number
 */
const generateRandomUsername = () => {
  const firstName = HOGWARTS_FIRST_NAMES[Math.floor(Math.random() * HOGWARTS_FIRST_NAMES.length)];
  const useTitle = Math.random() > 0.5;
  
  if (useTitle) {
    const title = HOGWARTS_TITLES[Math.floor(Math.random() * HOGWARTS_TITLES.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${firstName}_${title}_${number}`;
  } else {
    const number = Math.floor(Math.random() * 9999) + 1;
    return `${firstName}_${number}`;
  }
};

/**
 * Generate a unique username by checking against existing usernames in database
 * @param {number} maxAttempts - Maximum number of attempts to generate unique username
 * @returns {Promise<string>} - A unique username
 */
const generateUniqueUsername = async (maxAttempts = 100) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const username = generateRandomUsername();
    
    try {
      const { rows } = await db.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );
      
      if (rows.length === 0) {
        return username; // Username is unique
      }
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      throw error;
    }
    
    attempts++;
  }
  
  // Fallback: use timestamp-based username if we can't find a unique one
  const timestamp = Date.now();
  const firstName = HOGWARTS_FIRST_NAMES[Math.floor(Math.random() * HOGWARTS_FIRST_NAMES.length)];
  return `${firstName}_${timestamp}`;
};

module.exports = {
  generateRandomUsername,
  generateUniqueUsername,
  HOGWARTS_FIRST_NAMES,
  HOGWARTS_TITLES
};

export const CLUB = {
  name: 'KU Car Club',
  tagline: 'Learn, Experience, Connect.',
  instagram: 'https://www.instagram.com/ku.car.club/',
  whatsapp: 'https://chat.whatsapp.com/JkFbOO5HqYm7sCNGOz8GKF',
} as const;
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

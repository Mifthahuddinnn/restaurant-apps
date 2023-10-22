import 'regenerator-runtime';
import '../styles/main.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import { toggleMenu } from './navbar';
import { fetchAndDisplayRestaurants } from './app';

const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', toggleMenu);

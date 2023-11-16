import CONFIG from '../../global/config';
import LikeButtonInitiator from '../../utils/like-button-initiator';
import fetchAndDisplayReviews from './review';
import FavoriteRestaurant from '../../data/favorite-restaurant';

export default async function loadRestaurantDetail(restaurantId, container) {
  try {
    const detailUrl = CONFIG.DETAIL.replace(':id', restaurantId);
    const response = await fetch(detailUrl);

    if (!response.ok) {
      throw new Error(`Error fetching restaurant details. Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.restaurant) {
      const detailPage = document.createElement('div');
      detailPage.classList.add('restaurant-detail');

      const menu = document.querySelector('.menu');
      if (menu) {
        menu.style.display = 'none';
      }

      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.style.display = 'none';
      }

      // Skip to Content Link
      const skipLink = document.createElement('a');
      skipLink.href = '#restaurant-description';
      skipLink.textContent = 'Skip to Content';
      skipLink.classList.add('skip-link');
      detailPage.appendChild(skipLink);

      // Restaurant Name
      const restaurantName = document.createElement('h2');
      restaurantName.textContent = data.restaurant.name;
      restaurantName.classList.add('restaurant-name');
      detailPage.appendChild(restaurantName);

      // Restaurant Image
      const restaurantImage = document.createElement('img');
      restaurantImage.src = CONFIG.IMAGE.replace('<pictureId>', data.restaurant.pictureId);
      restaurantImage.alt = data.restaurant.name;
      restaurantImage.setAttribute('loading', 'lazy');
      restaurantImage.setAttribute('crossorigin', 'anonymous');
      detailPage.appendChild(restaurantImage);

      // Restaurant Description
      const restaurantDescription = document.createElement('p');
      restaurantDescription.textContent = data.restaurant.description;
      restaurantDescription.classList.add('restaurant-description');
      restaurantDescription.id = 'restaurant-description';
      detailPage.appendChild(restaurantDescription);

      // Restaurant Address
      const restaurantAddress = document.createElement('p');
      restaurantAddress.textContent = `Address: ${data.restaurant.address}, ${data.restaurant.city}`;
      restaurantAddress.classList.add('restaurant-address');
      detailPage.appendChild(restaurantAddress);

      // Restaurant Categories
      const restaurantCategories = document.createElement('p');
      const categories = data.restaurant.categories.map((category) => category.name).join(', ');
      restaurantCategories.textContent = `Categories: ${categories}`;
      restaurantCategories.classList.add('restaurant-categories');
      detailPage.appendChild(restaurantCategories);

      // Restaurant Rating
      const restaurantRating = document.createElement('p');
      restaurantRating.textContent = `Rating: ${data.restaurant.rating}`;
      restaurantRating.classList.add('restaurant-rating');
      detailPage.appendChild(restaurantRating);

      // Food and Drink Menus Container
      const menusContainer = document.createElement('div');
      menusContainer.classList.add('menus-container');

      // Food Menu
      const foodMenu = document.createElement('div');
      foodMenu.classList.add('restaurant-foodMenu');
      foodMenu.innerHTML = `<h3>Food Menu</h3>
    <ul>
      ${data.restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
    </ul>`;
      menusContainer.appendChild(foodMenu);

      // Drink Menu
      const drinkMenu = document.createElement('div');
      drinkMenu.classList.add('restaurant-drinkMenu');
      drinkMenu.innerHTML = `<h3>Drink Menu</h3>
    <ul>
      ${data.restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
    </ul>`;
      menusContainer.appendChild(drinkMenu);

      detailPage.appendChild(menusContainer);

      // Customer Reviews
      const customerReviews = document.createElement('div');
      customerReviews.innerHTML = `<h3>Customer Reviews</h3>
          <ul id="reviews-list"></ul>`;
      detailPage.appendChild(customerReviews);

      container.appendChild(detailPage);

      fetchAndDisplayReviews(data.restaurant.customerReviews, document.getElementById('reviews-list'));

      const likeButtonContainer = document.createElement('div');
      likeButtonContainer.classList.add('like-button-container');

      LikeButtonInitiator.init({
        likeButtonContainer,
        restaurant: data.restaurant,
        favoriteRestaurants: await FavoriteRestaurant.getAllRestaurant(),
      });

      detailPage.appendChild(likeButtonContainer);
      likeButtonContainer.addEventListener('likeButtonClicked', async () => {
        await FavoriteRestaurant.putRestaurant(data.restaurant);
      });

      /* Back */
      const backButton = document.createElement('button');
      backButton.textContent = 'Back';
      backButton.classList.add('back-button');
      backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i><span>Back</span>';
      backButton.addEventListener('click', () => {
        window.location.href = '/index.html';
      });
      detailPage.appendChild(backButton);
    } else {
      console.error('Restaurant data not found.');
    }
  } catch (error) {
    console.error('Error loading restaurant detail:', error);
  }
}

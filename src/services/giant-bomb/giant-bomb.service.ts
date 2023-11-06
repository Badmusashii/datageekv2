import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GiantBombService {
  private baseURL = 'https://www.giantbomb.com/api';
  private apiKey = 'ff0f7bc832f02c51f88fd2286162f40173be0d19';

  async searchGame(query: string) {
    const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&field_list=name,guid,platforms,image,Images,Videos,site_detail_url,original_release_date,deck&filter=name:${query}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch from GiantBomb API: ${error.message}`);
    }
  }
  async searchGameByGuid(guid: string) {
    const gameDetailURL = `${this.baseURL}/game/${guid}/?api_key=${this.apiKey}&format=json&field_list=aliases,deck,description,image,image_tags,name,number_of_user_reviews,original_release_date,videos`;

    try {
      const response = await axios.get(gameDetailURL);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch game details from GiantBomb API: ${error.message}`,
      );
    }
  }

  async getAdditionalGameImages(guid: string) {
    const imagesURL = `${this.baseURL}/images/${guid}/?api_key=${this.apiKey}&format=json&field_list=medium_url,small_url,original_url,image_tags`;

    try {
      const response = await axios.get(imagesURL);

      const allImages = response.data.results;

      // Filtrer pour obtenir uniquement les screenshots
      const screenshots = allImages.filter(
        (image: { image_tags: string | string[] }) =>
          image.image_tags && image.image_tags.includes('Screenshots'),
      );

      // Si on a au moins 6 screenshots, on les utilise
      if (screenshots.length >= 6) {
        const randomSixScreenshots = screenshots
          .slice(0, 6)
          .map((item: { small_url: any }) => item.small_url);
        return randomSixScreenshots;
      }

      // Si on n'a pas suffisamment de screenshots, on utilise d'autres images
      if (allImages.length >= 6) {
        const randomSixImages = allImages
          .slice(0, 6)
          .map((item) => item.small_url);
        return randomSixImages;
      } else {
        // Sinon, retourner toutes les images disponibles
        return allImages.map((item: { small_url: any }) => item.small_url);
      }
    } catch (error) {
      throw new Error(`Failed to fetch additional images: ${error.message}`);
    }
  }
}

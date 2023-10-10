import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GiantBombService {
  private baseURL = 'https://www.giantbomb.com/api';
  private apiKey = 'ff0f7bc832f02c51f88fd2286162f40173be0d19';

  // async searchGame(query: string) {
  //   const url = `${this.baseURL}/search/?api_key=${this.apiKey}&format=json&query=${query}&resources=game`;
  //   try {
  //     const response = await axios.get(url);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch from GiantBomb API: ${error.message}`);
  //   }
  // }
  async searchGame(query: string) {
    // const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&query=name:${query},platforms:23`;
    // const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&field_list=name,platforms&query=${query}`;
    // const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&field_list=name,platforms,image,Images,Vidéos,site_detail_url`;

    // const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&field_list=name,platforms,image,Images,Vidéos,site_detail_url&filter=name:${query}`;

    const url = `${this.baseURL}/games/?api_key=${this.apiKey}&format=json&field_list=name,platforms,image,Images,Videos,site_detail_url,original_release_date,deck&filter=name:${query}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch from GiantBomb API: ${error.message}`);
    }
  }
}

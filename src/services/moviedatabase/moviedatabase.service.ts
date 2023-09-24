import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviedatabaseService {
  private baseURL = 'https://api.themoviedb.org/3';
  private apiKey = '2bd4d1bba87cd9ad8b3f9888a91eb406'; // Assurez-vous de protéger cette clé dans une véritable application.
  private bearerToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmQ0ZDFiYmE4N2NkOWFkOGIzZjk4ODhhOTFlYjQwNiIsInN1YiI6IjY0MDA5NjE2OTY1M2Y2MDA4OTRmMTFjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v8Q7bSbO87xW9sOg8cV7Amd_BrO2DDLEYoJ9WpGsMb0';

  async searchMovie(query: string) {
    const url = `${this.baseURL}/search/movie?api_key=${this.apiKey}&language=fr-FR&query=${query}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch from TMDB API: ${error.message}`);
    }
  }

  async getSeriesDetails(seriesId: number) {
    const url = `${this.baseURL}/tv/${seriesId}?api_key=${this.apiKey}&language=fr-FR`;
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`,
      accept: 'application/json',
    };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch series details from TMDB API: ${error.message}`,
      );
    }
  }
}

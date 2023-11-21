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

  async getMovieDetailsWithVideos(movieId: number) {
    const url = `${this.baseURL}/movie/${movieId}?api_key=${this.apiKey}&language=fr-FR&append_to_response=videos`;

    try {
      const response = await axios.get(url);
      const apiResponse = response.data;

      if (apiResponse && apiResponse.videos && apiResponse.videos.results) {
        let filteredVideos = apiResponse.videos.results
          .filter(
            (video: {
              iso_639_1: string;
              iso_3166_1: string;
              site: string;
              size: number;
              type: string;
              name: string;
            }) =>
              (video.iso_639_1 === 'fr' || video.iso_3166_1 === 'FR') &&
              video.site === 'YouTube' &&
              video.size === 1080 &&
              video.type === 'Trailer' &&
              !video.name.includes('VOST'),
          )
          .slice(0, 2); // Prendre seulement les deux premières vidéos

        // Si aucun résultat n'est trouvé, prendre les deux premières vidéos sans filtre
        if (filteredVideos.length === 0) {
          filteredVideos = apiResponse.videos.results.slice(0, 2);
        }

        // Remplace les résultats vidéo originaux par les vidéos filtrées
        apiResponse.videos.results = filteredVideos;
      }

      return apiResponse;
    } catch (error) {
      throw new Error(
        `Failed to fetch movie videos from TMDB API: ${error.message}`,
      );
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
      const apiResponse = response.data;

      return apiResponse;
    } catch (error) {
      throw new Error(
        `Failed to fetch series details from TMDB API: ${error.message}`,
      );
    }
  }
  async getMoviePoster(movieId: number) {
    const url = `${this.baseURL}/movie/${movieId}?api_key=${this.apiKey}&language=fr-FR`;

    try {
      const response = await axios.get(url);
      const apiResponse = response.data;
      console.log(apiResponse);

      return {
        posterPath: apiResponse.poster_path,
        idapi: apiResponse.id,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch movie poster from TMDB API: ${error.message}`,
      );
    }
  }
}

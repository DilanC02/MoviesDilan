import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getComments } from '../interface/IComment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private http = inject(HttpClient);
  private apiKey = '2e0e8f44a19aaa881e90817406fc1caf';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor() { }

  // Búsqueda de películas
  searchMovies(nombre: string) {
    return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${nombre}&include_adult=false&language=es-ES&page=1`);
  }

  // Búsqueda de actores
  searchActors(nombre: string) {
    return this.http.get(`${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${nombre}&include_adult=false&language=es-ES&page=1`);
  }

  // Obtener géneros
  getGenres() {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`);
  }

  // Obtener películas por género
  getMoviesByGenre(genreId: number) {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=es-ES&sort_by=popularity.desc&page=1`);
  }

  // Obtener películas por actor
  getMoviesByActor(personId: number) {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_cast=${personId}&language=es-ES&sort_by=popularity.desc&page=1`);
  }

  // Métodos existentes
  getMovieDetails(codeMovie: string) {
    return this.http.get(`${this.baseUrl}/movie/${codeMovie}?api_key=${this.apiKey}&language=es-ES`);
  }

  getTrendingMovies() {
    return this.http.get(`${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}&language=es-ES`);
  }

  getPopularMovies() {
    return this.http.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=1`);
  }

  getActors() {
    return this.http.get(`${this.baseUrl}/search/person?api_key=${this.apiKey}&language=es-ES&query=tomas&page=1&include_adult=false`);
  }

  saveComment(user_id: number, movie_id: number, comment: string) {
    const token = localStorage.getItem('token');
    const headers = {'Authorization': `Bearer ${token}`};
    return this.http.post('http://localhost:3000/api/comment/', {user_id, movie_id, comment}, {headers});
  }

  getComments(movie_id: number) {
    const token = localStorage.getItem('token');
    const headers = {'Authorization': `Bearer ${token}`};
    return this.http.get<getComments[]>(`http://localhost:3000/api/comment/${movie_id}`, {headers: headers});
  }
}

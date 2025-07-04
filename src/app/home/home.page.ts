import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MoviesService } from '../servicios/movies.service';
import { addIcons } from 'ionicons';
import { library, homeOutline, radio, search } from 'ionicons/icons';

import {
  IonHeader,
  IonSearchbar,
  IonContent,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonRouterOutlet,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonChip,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    CommonModule,
    RouterModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonChip,
    IonText,
    IonSpinner
  ]
})
export class HomePage implements OnInit {
  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;

  searchQuery: string = '';
  searchType: string = 'movie';
  movieResults: any[] = [];
  actorResults: any[] = [];
  genreMovies: any[] = [];
  genres: any[] = [];
  isLoading: boolean = false;
  selectedGenreName: string = '';

  private moviesService = inject(MoviesService);

  constructor() {
    addIcons({ library, homeOutline, radio, search });
  }

  ngOnInit() {
    this.loadGenres();
  }

  handleInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.performSearch();
  }

  handleClear() {
    this.searchQuery = '';
    this.clearResults();
  }

  handleSegmentChange(event: any) {
    this.searchType = event.detail.value;
    this.clearResults();
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  performSearch() {
    const trimmedQuery = this.searchQuery?.trim() || '';

    if (!trimmedQuery) {
      this.clearResults();
      return;
    }

    this.isLoading = true;

    switch (this.searchType) {
      case 'movie':
        this.searchMovies(trimmedQuery);
        break;
      case 'person':
        this.searchActors(trimmedQuery);
        break;
      case 'genre':
        this.searchGenres(trimmedQuery);
        break;
    }
  }

  searchMovies(query: string) {
    this.moviesService.searchMovies(query).subscribe({
      next: (response: any) => {
        this.movieResults = response.results || [];
        this.isLoading = false;
        console.log('Películas encontradas:', this.movieResults);
      },
      error: (error) => {
        console.error('Error al buscar películas:', error);
        this.movieResults = [];
        this.isLoading = false;
      }
    });
  }

  searchActors(query: string) {
    this.moviesService.searchActors(query).subscribe({
      next: (response: any) => {
        this.actorResults = response.results?.filter((actor: any) => actor.known_for_department === 'Acting') || [];
        this.isLoading = false;
        console.log('Actores encontrados:', this.actorResults);
      },
      error: (error) => {
        console.error('Error al buscar actores:', error);
        this.actorResults = [];
        this.isLoading = false;
      }
    });
  }

  searchGenres(query: string) {
    const matchingGenres = this.genres.filter(genre =>
      genre.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingGenres.length > 0) {
      this.selectGenre(matchingGenres[0]);
    } else {
      this.isLoading = false;
    }
  }

  selectActor(actor: any) {
    this.isLoading = true;
    this.moviesService.getMoviesByActor(actor.id).subscribe({
      next: (response: any) => {
        this.movieResults = response.results || [];
        this.searchType = 'movie';
        this.actorResults = [];
        this.isLoading = false;
        console.log(`Películas de ${actor.name}:`, this.movieResults);
      },
      error: (error) => {
        console.error('Error al buscar películas por actor:', error);
        this.isLoading = false;
      }
    });
  }

  selectGenre(genre: any) {
    this.isLoading = true;
    this.selectedGenreName = genre.name;
    this.moviesService.getMoviesByGenre(genre.id).subscribe({
      next: (response: any) => {
        this.genreMovies = response.results || [];
        this.isLoading = false;
        console.log(`Películas del género ${genre.name}:`, this.genreMovies);
      },
      error: (error) => {
        console.error('Error al buscar películas por género:', error);
        this.isLoading = false;
      }
    });
  }

  loadGenres() {
    this.moviesService.getGenres().subscribe({
      next: (response: any) => {
        this.genres = response.genres || [];
        console.log('Géneros cargados:', this.genres);
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
      }
    });
  }

  clearResults() {
    this.movieResults = [];
    this.actorResults = [];
    this.genreMovies = [];
    this.isLoading = false;
    this.selectedGenreName = '';
  }

  hasResults(): boolean {
    return this.movieResults.length > 0 ||
           this.actorResults.length > 0 ||
           this.genreMovies.length > 0;
  }

  getImageUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/img/default-movie.png';
  }

  getPersonImageUrl(profilePath: string): string {
    return profilePath ? `https://image.tmdb.org/t/p/w500${profilePath}` : 'assets/img/default-person.png';
  }

  getKnownForText(knownFor: any[]): string {
    return knownFor
      .slice(0, 2)
      .map(item => item.title || item.name)
      .join(', ');
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  trackByActorFn(index: number, actor: any) {
    return actor.id;
  }
}

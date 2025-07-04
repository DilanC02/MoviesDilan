import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { MoviesService } from '../servicios/movies.service';

@Component({
  selector: 'app-premiere',
  templateUrl: './premiere.page.html',
  styleUrls: ['./premiere.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule
  ]
})
export class PremierePage implements OnInit {
  private moviesService = inject(MoviesService);
  trendingMovies: any[] = [];

  constructor() {}

  ngOnInit() {
    this.getTrendingMovies();
  }

  getTrendingMovies() {
    this.moviesService.getTrendingMovies().subscribe({
      next: (response: any) => {
        this.trendingMovies = response.results;
        console.log(this.trendingMovies);
      },
      error: (err: any) => {
        console.error('Error fetching trending movies:', err);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../servicios/movies.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.page.html',
  styleUrls: ['./popular.page.scss'],
  standalone: true,
  imports: [
    IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader,
    IonCard, IonCol, IonRow, IonGrid, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule
  ]
})
export class PopularPage implements OnInit {

  popularMovies: any[] = [];

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.getPopularMovies();
  }

  getPopularMovies() {
    this.moviesService.getPopularMovies().subscribe({
      next: (data: any) => {
        this.popularMovies = data.results;
        console.log(this.popularMovies);
      },
      error: (err) => console.error(err)
    });
  }

}

import { Comment, getComments } from './../interface/IComment';
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonRow, IonCol, IonCard, IonCardContent, IonButton,
  IonGrid, IonIcon, IonItem, IonLabel, IonCheckbox, IonInput, IonText, IonNote, IonList, IonTabButton } from '@ionic/angular/standalone';
import { MoviesService } from '../servicios/movies.service';
import { addIcons } from 'ionicons';
import { save, sendOutline, chevronForward, chatbubbleEllipsesOutline, add, addOutline } from 'ionicons/icons';
//import { Comment } from '../interface/comment.interface'; // Asegúrate de que esta ruta sea correcta
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [IonTabButton, IonList, IonNote, IonText,
    IonInput, IonCheckbox, IonLabel, IonItem, IonIcon,
    IonGrid, IonButton, IonCardContent, IonCard, IonCol,
    IonRow, IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule
  ]
})
export class DetailPage implements OnInit {
  private serviceMovies = inject(MoviesService);
  private ActivatedRoute = inject(ActivatedRoute);

  idMovie!: string;
  idUser!: string;
  detailMovie!: any;
  stateComment!: boolean;
  comments !: getComments[];
  public userComment: string = '';

  constructor() {
    addIcons({addOutline,sendOutline,chevronForward,add,chatbubbleEllipsesOutline});
    this.idUser = localStorage.getItem('id') || '';
    this.idMovie = this.ActivatedRoute.snapshot.paramMap.get('id')?.toString()!;
  }

  ngOnInit() {
    this.getMovieDetails(this.idMovie);
    this.getComments();
  }

  getMovieDetails(codeMovie: string) {
    this.serviceMovies.getMovieDetails(codeMovie).subscribe({
      next: (dato: any) => {
        this.detailMovie = dato;
        console.log(this.detailMovie);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  setStateComment() {
    this.stateComment = !this.stateComment;
    console.log('Estado del comentario:', this.stateComment);
  }

  saveComment(comentario:any) {
    this.serviceMovies.saveComment(parseInt(this.idUser), parseInt(this.idMovie), comentario.value).subscribe({
      next: (response) => {
        console.log('Comentario guardado:', response);
        this.userComment = ''; // Limpiar el input después de guardar
      },
      error: (error: any) => {
        console.error('Error al guardar el comentario:', error);
      }
    });
  }

  getComments() {
    this.serviceMovies.getComments(parseInt(this.idMovie)).subscribe({
      next: (response: getComments[]) => {
        this.comments = response;
        console.log('Comentarios obtenidos:', response);
      },
      error: (error: any) => {
        console.error('Error al obtener los comentarios:', error);
      }
    });
  }

}

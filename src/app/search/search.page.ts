import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SearchPage implements OnInit {


  userName!: string
  constructor() { }

  ngOnInit() {
    // Aquí puedes agregar lógica de inicialización si necesitas
    this.userName = localStorage.getItem('user') || '';
  }

}

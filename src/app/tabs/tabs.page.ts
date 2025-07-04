import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router'; // ✅ IMPORTACIÓN NECESARIA

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, // ✅ AGREGA ESTO PARA QUE FUNCIONE routerLink
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon
  ]
})
export class TabsPage implements OnInit {
  constructor() { }

  ngOnInit() { }
}

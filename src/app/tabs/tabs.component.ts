import { Component, OnInit } from '@angular/core';
import { IonIcon, IonTabBar, IonTabs,IonTabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filmOutline, homeOutline, appsOutline, search } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor() {

    addIcons({ homeOutline, filmOutline, appsOutline, search });

   }

  ngOnInit() {}

}

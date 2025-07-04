import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}

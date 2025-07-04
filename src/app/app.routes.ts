import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
         path: 'home',
         loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
         children:[
          {
             path: 'detail/:id',
             loadComponent: () => import('./detail/detail.page').then( m => m.DetailPage)
         },
         ]
      },
      {
        path: 'premiere',
        loadComponent: () => import('./premiere/premiere.page').then( m => m.PremierePage)
      },
      {
        path: 'popular',
        loadComponent: () => import('./popular/popular.page').then( m => m.PopularPage)
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
      }
    ]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
];

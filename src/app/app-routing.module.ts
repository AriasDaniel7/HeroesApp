import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { canActivateGuardHeroes, canMatchGuardHeroes } from './auth/guards/heroes.guard';
import { canActivateGuardLogin, canMatchGuardLogin } from './auth/guards/login.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canMatch: [canMatchGuardLogin],
    canActivate: [canActivateGuardLogin],
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    canMatch: [canMatchGuardHeroes],
    canActivate: [canActivateGuardHeroes],
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

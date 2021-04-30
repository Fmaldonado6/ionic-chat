import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./screens/auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./screens/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./screens/main/main.module').then(m => m.MainPageModule),
    canLoad: [AuthGuard]

  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

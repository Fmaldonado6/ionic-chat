import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./screens/auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./screens/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./screens/main/main.module').then(m => m.MainPageModule),

  },
  {
    path: 'newChat',
    loadChildren: () => import('./screens/new-chat/new-chat.module').then(m => m.NewChatPageModule),

  },
  {
    path: 'chat',
    loadChildren: () => import('./screens/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'change-pass',
    loadChildren: () => import('./screens/chat/change-pass/change-pass.module').then( m => m.ChangePassPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

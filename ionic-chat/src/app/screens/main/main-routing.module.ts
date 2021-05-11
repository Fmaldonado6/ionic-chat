import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: "chats",
        loadChildren: () => import('./tabs/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: "account",
        loadChildren: () => import('./tabs/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: "",
        redirectTo: "chats"
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }

import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_gurads/auth.guard';

export const appRoutes: Routes = [
{path: 'home' , component: HomeComponent},
{
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        {path: 'members' , component: MemberListComponent},
        {path: 'messages' , component: MessagesComponent},
        {path: 'lists' , component: ListComponent}
    ]
},
{path: '**' , redirectTo: 'home' , pathMatch: 'full'}
];
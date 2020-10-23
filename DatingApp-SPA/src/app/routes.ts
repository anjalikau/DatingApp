import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberUpdateComponent } from './members/member-update/member-update.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_gurads/auth.guard';
import { PreventUnsavedChanges } from './_gurads/prevent-unsaved-changes.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberUpdateResolver } from './_resolvers/member-update.resolver';

export const appRoutes: Routes = [
{path: 'home' , component: HomeComponent},
{
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        {path: 'members' , component: MemberListComponent , resolve: {users: MemberListResolver}},
        {path: 'members/:id' , component: MemberDetailComponent , resolve: {user: MemberDetailResolver}},
        {path: 'member/update' , component: MemberUpdateComponent 
        , resolve: {user: MemberUpdateResolver}, canDeactivate:[PreventUnsavedChanges]},
        {path: 'messages' , component: MessagesComponent},
        {path: 'lists' , component: ListComponent}
    ]
},
{path: '**' , redirectTo: 'home' , pathMatch: 'full'}
];
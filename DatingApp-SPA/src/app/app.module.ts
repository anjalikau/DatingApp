import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeagoModule } from 'ngx-timeago';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { AlertifyService } from './_services/alertify.service';
import { AuthGuard } from './_gurads/auth.guard';
import { UserService } from './_services/user.service';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberUpdateComponent } from './members/member-update/member-update.component';
import { MemberUpdateResolver } from './_resolvers/member-update.resolver';
import { PreventUnsavedChanges } from './_gurads/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';


export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent
    , NavComponent
    , HomeComponent
    , RegisterComponent
    , MemberListComponent
    , ListComponent
    , MessagesComponent
    , MemberCardComponent
    , MemberDetailComponent
    , MemberUpdateComponent
    , PhotoEditorComponent
  ],
  imports: [
    BrowserModule
    , BrowserAnimationsModule
    , HttpClientModule
    , FormsModule
    , ReactiveFormsModule
    , BrowserAnimationsModule
    , BsDropdownModule.forRoot()
    , PaginationModule.forRoot()
    , ButtonsModule.forRoot()
    , BsDatepickerModule.forRoot()
    , TabsModule.forRoot()
    , TimeagoModule.forRoot()
    , RouterModule.forRoot(appRoutes)
    , NgxGalleryModule
    , FileUploadModule
    , JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/api/auth']
      }
    }),
  ],
  providers: [
    AuthService
    , ErrorInterceptorProvider
    , AlertifyService
    , AuthGuard
    , UserService
    , MemberDetailResolver
    , MemberListResolver
    , MemberUpdateResolver
    , PreventUnsavedChanges
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}

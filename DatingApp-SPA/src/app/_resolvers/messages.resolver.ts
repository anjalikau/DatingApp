import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userservice: UserService, private router: Router, private authService: AuthService
            , private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userservice.getMessages(this.authService.decodedToken.nameid
            , this.pageNumber, this.pageSize , this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving messages');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getUsers(page? , itemsPerPage? , userParams? , likeParams?): Observable<PaginatedResult<User[]>> {
  const paginationResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let params = new HttpParams();

  if (page != null && itemsPerPage != null)
  {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);    
  }

  if(userParams != null)
  {
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
  }

  if (likeParams === "Likers"){
    params = params.append('likers', 'true');
  }

  if (likeParams === "Likees"){
    params = params.append('likees', 'true');
  }

  return this.http.get<User[]>(this.baseUrl + 'user' , { observe : 'response' , params})
  .pipe (
    map(response => {
      paginationResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult;
    })
  );
}

getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'user/' + id );
}

updateUser(id: number, user: User): Observable<User> {
  return this.http.put<User>(this.baseUrl + 'user/' + id , user );
}

setMainPhoto(userId: number, id: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain' , {});
}

DeletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

sendLike(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'user/' + id + '/like/' + recipientId,{});
}

getMessages(id: number, page? , itemsPerPage? , messageContainer?)
{
  const paginationResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

  let params = new HttpParams();

  params = params.append('MessageContainer' , messageContainer);

  if (page != null && itemsPerPage != null)
  {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  return this.http.get<Message[]>(this.baseUrl + 'user/' + id + '/messages' , { observe : 'response' , params})
  .pipe (
    map(response => {
      paginationResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult;
    })
  );
}

getMessageThread(id: number, recipientId: number) {
  return this.http.get<Message[]>(this.baseUrl + 'user/' + id + '/messages/thread/' + recipientId);
}

sendMessage(id: number, message: Message) {
  return this.http.post(this.baseUrl + 'user/' + id + '/messages' , message);
}

deleteMessage(id: number, userId: number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + id , {});
}

markAsRead(userId: number, messageId: number) {
  return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messageId + '/read', {})
  .subscribe();
}

}

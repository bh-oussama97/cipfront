import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private storage = sessionStorage;

  private messageSource = new BehaviorSubject<any>(JSON.parse(this.storage.getItem('item')));

  currentMessage$ = this.messageSource.asObservable();
  private taskCompletionSubject = new Subject<void>();

  constructor(private http: HttpClient) {
   }

  transfertObject(message: any) {
    this.messageSource.next(message);
    this.storage.setItem('item', JSON.stringify(message));
  }

  getObject()
  {
    return this.messageSource.asObservable();
  }

  getObjectFromSessionStorage()
  {
    return JSON.parse(this.storage.getItem('item'));
  }

  clearObject()
  {
    this.storage.clear();
  }

  notifyTaskCompletion() {
    this.taskCompletionSubject.next();
  }

  get taskCompletion$(): Observable<void> {
    return this.taskCompletionSubject.asObservable();
  }

}

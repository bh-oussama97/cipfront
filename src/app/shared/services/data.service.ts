import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private storage = sessionStorage;

  // private messageSource = new BehaviorSubject<any>(JSON.parse(this.storage.getItem('item')) || {});

  private messageSource = new BehaviorSubject<any>(null);

  // currentMessage$ = this.messageSource.asObservable();
  private taskCompletionSubject = new Subject<void>();

  private confirmValueSubject = new BehaviorSubject<boolean>(null);

  constructor() {
   }

   transferConfirmValue(value:boolean)
   {
    this.confirmValueSubject.next(value);
   }

   get getConfirmValue$(): Observable<boolean> {
    return this.confirmValueSubject.asObservable();
  }

  transfertObject(message: any) {
    this.messageSource.next(message);
    // this.storage.setItem('item', JSON.stringify(message));
  }

  getObject()
  {
    return this.messageSource.asObservable();
  }

  // getObjectFromSessionStorage()
  // {
  //   return JSON.parse(this.storage.getItem('item'));
  // }

  // clearObject()
  // {
  //   this.storage.clear();
  // }

  notifyTaskCompletion() {
    this.taskCompletionSubject.next();
  }

  get taskCompletion$(): Observable<void> {
    return this.taskCompletionSubject.asObservable();
  }

}

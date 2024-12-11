import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private url: string = environment.apiUrl;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://127.0.0.1:8000/ws/trades/AAPL/');
  }

  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message)
      console.log('Enviando mensaje:', message);

    }
  }
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  closeConnection(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  handleErrors() {
    console.log(this.socket$)
    if (this.socket$) {
      this.socket$.subscribe(
        message => {
          console.log('Mensaje recibido:', message);
        },
        error => {
          console.error('Error en WebSocket:', error);
        }
      );
    }
  }
}
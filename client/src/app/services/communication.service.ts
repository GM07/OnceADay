import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
    public static readonly serverAdress = "http://127.0.0.1"
    public static readonly serverPort = "5000"
}  

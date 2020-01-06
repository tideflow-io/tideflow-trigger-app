import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs'; 

import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor 
} from '@angular/common/http'; 

@Injectable()
export class InjectorService {

  constructor(
    private storage: Storage
  ) {
    
  }

  async intercept(request: HttpRequest<any>, next: HttpHandler) { 
    request = request.clone({ 
      setHeaders: { 
        'api-key': await this.storage.get('TF_TOKEN') || ''
      } 
    }); 
    return next.handle(request);
  } 

}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class TideflowService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async getFlows(query) {
    return new Promise(async (resolve, reject) => {

    let authToken = await this.storage.get('TF_TOKEN')

      if (!authToken) {
        return reject('no-token')
      }

      const httpOptions = {
        headers: new HttpHeaders({
          'api-key': authToken || 'null'
        })
      };

      const url = await this.genUrl('api/flows', query)
      return this.http.get(url, httpOptions)
        .subscribe(res => resolve(res), error => reject(error))
    })
  }

  async genUrl(path, query) {
    let urlSubfix = path
    if (query && Object.keys(query).length) {
      let params = new URLSearchParams(query)
      urlSubfix += `?${params.toString()}`
    }
    return `${await this.storage.get('TF_URL')}${urlSubfix}`
  }

  async jsonRequest(body) {
    const flowUrl = await this.storage.get('TF_FLOW_URL')
    return this.http.post(
      flowUrl,
      body
    ).toPromise()
  }

  async fileRequest(file) {
    const flowUrl = await this.storage.get('TF_FLOW_URL')
    
    const readFile = (file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {
              type: file.type
          });
          formData.append('file', imgBlob, file.name);
          doRequest(formData);
      };

      reader.readAsArrayBuffer(file.file);
    }

    const doRequest = (formData) => {
      return this.http.post(flowUrl, formData)
        .toPromise()
    }
  
    readFile(file)
  }
}

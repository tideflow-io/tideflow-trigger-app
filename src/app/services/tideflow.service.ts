import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TideflowService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async getFlows(query) {
    console.log(await this.genUrl('/api/flows', query))
    return this.http.get(
      await this.genUrl('/api/flows', query)
    ).toPromise()
  }

  async genUrl(path, query) {
    let urlSubfix = path
    if (query && Object.keys(query).length) {
      let params = new URLSearchParams(query)
      urlSubfix += `?${params.toString()}`
    }
    return `${await this.storage.get('TF_URL')}${urlSubfix}`
  }

  async jsonRequest(flow, body) {
    return this.http.post(
      await this.genUrl(`/api/flows/${flow}/trigger`, {}),
      body
    ).toPromise()
  }
}

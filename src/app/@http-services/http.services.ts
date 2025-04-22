
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})

export class HttpClientService{

  constructor(private http: HttpClient){}

  getApi(url: string){
    return this.http.get(url);
  }

  postApi(url: string, postData: any){
    return this.http.post(url, postData);
  }

  //更新
  putApi(url: string, postData: any){
    return this.http.put(url, postData);
  }

  delApi(url: string){
    return this.http.delete(url);
  }

}

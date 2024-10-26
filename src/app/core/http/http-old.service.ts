// import { Observable, map } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

// /* *Checking if a arg is object* */
// export function isObject(arg: unknown) {
//   return typeof arg === 'object' && arg !== null && !(arg instanceof Array)
//     ? arg
//     : false;
// }

// type IRequestType = 'DELETE' | 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'PUT';
// interface IRequestOptions {
//   body?: unknown;
//   useUrlPrefix?: boolean;
//   headers?:
//     | HttpHeaders
//     | {
//         [header: string]: string | string[];
//       };
//   observe?: 'body' | 'events' | 'response';
//   reportProgress?: boolean;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class HttpService {
//   constructor(private _http: HttpClient) {}

//   /**
//    * *Service for making backend calls
//    *
//    * @param method - request method
//    * @param url - request url
//    * @param params - request params
//    * @param options - request extra options
//    * @returns observable
//    */
//   private request(
//     method: IRequestType,
//     url: string,
//     params?: unknown,
//     options?: IRequestOptions
//   ): Observable<IResponse> {
//     let data;
//     let reqUrl = url;
//     let reqOptions: IRequestOptions = { useUrlPrefix: true };

//     if (isObject(options)) reqOptions = Object.assign(reqOptions, options);

//     // Assigning params
//     if (isObject(params)) {
//       if (params instanceof FormData) {
//         data = params;
//         reqOptions.reportProgress = reqOptions.reportProgress || true;
//       }
//       data = params;
//     }

//     // Checking url prefix
//     if (reqOptions.useUrlPrefix === true) {
//       reqUrl = environment.host + '/' + url;
//     }

//     reqOptions.body = data;
//     reqOptions.observe = reqOptions.observe || 'body';

//     // Final Request
//     const request$ = this._http.request(method, reqUrl, reqOptions);

//     request$.pipe(
//       map((response: HttpResponse<unknown>) => {
//         const responseObject = response.body;
//         return responseObject;
//       })
//     );

//     return request$;
//   }

//   /**
//    * *HTTP Post request
//    *
//    * @param url - request url
//    * @param params - request params
//    * @param options - request extra options
//    * @returns observable
//    */
//   public post(url: string, params?: unknown, options?: IRequestOptions) {
//     return this.request('POST', url, params, options);
//   }

//   /**
//    * *HTTP Put request
//    *
//    * @param url - request url
//    * @param params - request params
//    * @param options - request extra options
//    * @returns observable
//    */
//   public put(url: string, params?: unknown, options?: IRequestOptions) {
//     return this.request('PUT', url, params, options);
//   }

//   /**
//    * *HTTP Patch request
//    *
//    * @param url - request url
//    * @param params - request params
//    * @param options - request extra options
//    * @returns observable
//    */
//   public patch(url: string, params?: unknown, options?: IRequestOptions) {
//     return this.request('PATCH', url, params, options);
//   }

//   /**
//    * *HTTP Get request
//    *
//    * @param url - request url
//    * @param options - request extra options
//    * @returns observable
//    */
//   public get(url: string, options?: IRequestOptions) {
//     return this.request('GET', url, {}, options);
//   }

//   /**
//    * *HTTP Delete request
//    *
//    * @param url - request url
//    * @param params - request params
//    * @param options - request extra options
//    * @returns observable
//    */
//   public delete(url: string, params?: unknown, options?: IRequestOptions) {
//     return this.request('DELETE', url, params, options);
//   }
// }

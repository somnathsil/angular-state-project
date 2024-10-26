import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface IRequestOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  responseType?: 'json';
  reportProgress?: boolean;
  withCredentials?: boolean;
  observe?: 'body';
}

interface IResponse {
  response: Optional<{
    data?: any;
    dataset?: any;
    dataSet?: any;
    status: any;
    msg?: string;
    message?: string;
  }>;
  status: number;
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

interface IRequestParams {
  [key: string]: string | string[] | Record<string, string>;
}

interface IRequestConfig {
  body?: unknown;
  urlPrefix: boolean;
  headers: Record<string, string>;
  params: IRequestParams | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.host;

  /**
   * *Makes an HTTP GET request.
   *
   * @param {string} path - The URL path.
   * @param {any} params - The query parameters.
   * @param {boolean} urlPrefix - prefix for the url.
   * @param {Record<string, string>} headers - The request headers.
   * @returns An observable of the HTTP response.
   *
   *
   */
  public get(
    path: string,
    params?: IRequestParams,
    urlPrefix = true,
    headers: Record<string, string> = {}
  ): Observable<IResponse> {
    const { url, options } = this.getUrlAndOptions(path, {
      params,
      headers,
      urlPrefix,
    });
    return this.http.get<IResponse>(url, options);
  }

  /**
   * *Makes an HTTP POST request.
   *
   * @param {string} path - The URL path.
   * @param {any} body - The request body.
   * @param {any} params - The query parameters.
   * @param {boolean} urlPrefix - prefix for the url.
   * @param {Record<string, string>} headers - The request headers.
   * @returns An observable of the HTTP response.
   *
   *
   */
  public post(
    path: string,
    body: unknown,
    params?: IRequestParams,
    urlPrefix = true,
    headers: Record<string, string> = {}
  ): Observable<IResponse> {
    const { url, options } = this.getUrlAndOptions(path, {
      body,
      params,
      headers,
      urlPrefix,
    });
    return this.http.post<IResponse>(url, body, options);
  }

  /**
   * *Makes an HTTP PUT request.
   *
   * @param {string} path - The URL path.
   * @param {any} body - The request body.
   * @param {any} params - The query parameters.
   * @param {boolean} urlPrefix - prefix for the url.
   * @param {Record<string, string>} headers - The request headers.
   * @returns An observable of the HTTP response.
   *
   *
   */
  public put(
    path: string,
    body: unknown,
    params?: IRequestParams,
    urlPrefix = true,
    headers: Record<string, string> = {}
  ): Observable<IResponse> {
    const { url, options } = this.getUrlAndOptions(path, {
      body,
      params,
      headers,
      urlPrefix,
    });
    return this.http.put<IResponse>(url, body, options);
  }

  /**
   * *Makes an HTTP PATCH request.
   *
   * @param {string} path - The URL path.
   * @param {any} body - The request body.
   * @param {any} params - The query parameters.
   * @param {boolean} urlPrefix - prefix for the url.
   * @param {Record<string, string>} headers - The request headers.
   * @returns An observable of the HTTP response.
   *
   *
   */
  public patch(
    path: string,
    body: unknown,
    params?: IRequestParams,
    urlPrefix = true,
    headers: Record<string, string> = {}
  ): Observable<IResponse> {
    const { url, options } = this.getUrlAndOptions(path, {
      body,
      params,
      headers,
      urlPrefix,
    });
    return this.http.patch<IResponse>(url, body, options);
  }

  /**
   * *Makes an HTTP DELETE request.
   *
   * @param {string} path - The URL path.
   * @param {any} params - The query parameters.
   * @param {boolean} urlPrefix - prefix for the url.
   * @param {Record<string, string>} headers - The request headers.
   * @returns An observable of the HTTP response.
   *
   *
   */
  public delete(
    path: string,
    params?: IRequestParams,
    urlPrefix = true,
    headers: Record<string, string> = {}
  ): Observable<IResponse> {
    const { url, options } = this.getUrlAndOptions(path, {
      params,
      headers,
      urlPrefix,
    });
    return this.http.delete<IResponse>(url, options);
  }

  /**
   * * Constructs the URL and request options objects using the provided path, parameters, headers, and body.
   *
   * @param {string} path - The URL path.
   * @param {IRequestConfig} config - The config object to be used in the request.
   * @returns An object containing the URL and options objects.
   *
   *
   */
  private getUrlAndOptions(
    path: string,
    config: IRequestConfig
  ): { url: string; options: IRequestOptions } {
    const url = this.getUrl(path, config.urlPrefix);
    const httpParams = this.getHttpParams(config.params);
    const httpHeaders = this.getHttpHeaders(config.headers);

    const options: IRequestOptions = {
      headers: httpHeaders,
      params: httpParams,
      observe: 'body',
    };

    if (config.body instanceof FormData) {
      options.reportProgress = true;
    }

    return { url, options };
  }

  /**
   * *Constructs the URL using the provided path and API URL prefix.
   *
   * @param {string} path - The URL path.
   * @param {boolean} urlPrefix - prefix for the url.
   * @returns The constructed URL.
   *
   *
   */
  private getUrl(path: string, urlPrefix = true): string {
    return urlPrefix ? `${this.apiUrl}/${path}` : `${path}`;
  }

  /**
   * *Constructs an instance of HttpHeaders using the provided headers.
   *
   * @param {Record<string, string>} headers - The headers to be used in the request.
   * @returns The instance of HttpHeaders.
   *
   *
   */
  private getHttpHeaders(headers: Record<string, string>): HttpHeaders {
    const httpHeaders = new HttpHeaders();
    for (const [key, value] of Object.entries(headers)) {
      if (value !== null) {
        httpHeaders.set(key, value);
      }
    }
    return httpHeaders;
  }

  /**
   * *Constructs an instance of HttpParams using the provided parameters.
   *
   * @param {IRequestParams} params - The parameters to be used in the request.
   * @returns The instance of HttpParams.
   *
   *
   */
  private getHttpParams(params?: IRequestParams): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach((val: string) => {
            httpParams = httpParams.append(`${key}[]`, val);
          });
        } else if (typeof value === 'object') {
          Object.keys(value).forEach((nestedKey) => {
            httpParams = httpParams.append(
              `${key}[${nestedKey}]`,
              value[nestedKey]
            );
          });
        } else {
          httpParams = httpParams.append(key, value);
        }
      });
    }
    return httpParams;
  }
}

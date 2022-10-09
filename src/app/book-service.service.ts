import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Author } from './services/data/Author';
import { Book } from './services/data/Book';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  // *********************************** AUTHOR*****************************
  public getAllAuthors(): Observable<Author[]>{
    return this.http.
    get<Author[]>(`${this.baseUrl}`+"/authors")
            .pipe(
                catchError(error => {
                    let errorMsg: string;
                    if (error.error instanceof ErrorEvent) {
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        errorMsg = this.getServerErrorMessage(error);
                    }

                    return throwError(errorMsg);
                })
            );
}
public saveAuthor(authors:Author[]): Observable<Author> {
  return this.http
          .post<Author>(this.baseUrl+"/authors", authors)
          .pipe(
              catchError(error => {
                  let errorMsg: string;
                  if (error.error instanceof ErrorEvent) {
                      errorMsg = `Error: ${error.error.message}`;
                  } else {
                      errorMsg = this.getServerErrorMessage(error);
                  }

                  return throwError(errorMsg);
              })
          );
}
  // ***********************************BOOK********************************

  public getAllBooks(): Observable<Book[]>{
    return this.http.
    get<Book[]>(`${this.baseUrl}`+"/books")
            .pipe(
                catchError(error => {
                    let errorMsg: string;
                    if (error.error instanceof ErrorEvent) {
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        errorMsg = this.getServerErrorMessage(error);
                    }

                    return throwError(errorMsg);
                })
            );
}

public saveBook(book :Book): Observable<Book> {
  return this.http
          .post<Book>(this.baseUrl+"/book", book)
          .pipe(
              catchError(error => {
                  let errorMsg: string;
                  if (error.error instanceof ErrorEvent) {
                      errorMsg = `Error: ${error.error.message}`;
                  } else {
                      errorMsg = this.getServerErrorMessage(error);
                  }

                  return throwError(errorMsg);
              })
          );
}
public updateBook(book:Book): Observable<Book>{
  return this.http
  .put<Book>(this.baseUrl+"/book",book)
  .pipe(
      catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error.message}`;
          } else {
              errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(errorMsg);
      })
  );
}

httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    "Access-Control-Allow-Origin": "*",
    
  } ),responseType: 'text' as 'json'
};

public suppBook(id:number){
  return this.http
  .delete<string>(this.baseUrl+"/book/"+ id,this.httpOptions)
  .pipe(
      catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error.message}`;
          } else {
              errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(errorMsg);
      })
  );
}

// ************************************ERRORS************************************

private getServerErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 409  :{
      return ` existe déjà`;
    }
      case 404: {
          return `Aucun résultat trouvé `;
      }
      case 403: {
          return `Accès refusé`;
      }
      case 500: {
          return `une erreur est survenue veuillez réessayer ultérieurement`;
      }
      default: {
          return `Erreur inconnue: ${error.message}`;
      }

  }
} 
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageListResponse, ImageSummary } from '../models/image.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {

  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  getImages(limit: number = 10, offset: number = 0): Observable<ImageListResponse> {
    return this.http.get<ImageListResponse>(
      `${this.apiUrl}?limit=${limit}&offset=${offset}`
    );
  }

  getImageById(id: string): Observable<ImageSummary> {
    return this.http.get<ImageSummary>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<ImageSummary> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageSummary>(`${this.apiUrl}/upload`, formData);
  }
}
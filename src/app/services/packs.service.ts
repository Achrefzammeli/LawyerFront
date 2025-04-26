import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pack } from '../models/pack';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PacksService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${environment.backend_url}packs`, { headers: this.getAuthHeaders() });
  }

  // New method to create a pack
  createPack(pack: Pack): Observable<Pack> {
    return this.http.post<Pack>(`${environment.backend_url}packs`, pack, { headers: this.getAuthHeaders() });
  }

  // New method to delete a pack by ID
  deletePack(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}packs/${id}`, { headers: this.getAuthHeaders() });
  
  }
  getPackStats(): Observable<any> {
    return this.http.get<any>(`${environment.backend_url}packs/stats`, {
      headers: this.getAuthHeaders()
    });
  } 
  updatePack(id: number, pack: Pack): Observable<any> {
    return this.http.put(`${environment.backend_url}packs/${id}`, pack, {
      headers: this.getAuthHeaders()
    });
  }
  getMonthlyStats() {
    return this.http.get<{ [month: string]: { [type: string]: number } }>(
      'http://localhost:8081/api/packs/stats-mensuelles'
   ,{headers:this.getAuthHeaders()} );
  }
}

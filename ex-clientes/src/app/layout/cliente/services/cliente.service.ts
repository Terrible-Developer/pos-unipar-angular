import { take } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/shared/services/base-rest.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseRestService {

  public buscarTodos(): Observable<Cliente[]> {
    return this.getter<Cliente[]>('clientes').pipe(take(1));
  }

  public buscarTodosQuery(filtros: any): Observable<Cliente[]> {
    const query = new Array<string>();
    if (filtros.id) {
      query.push(`id=${filtros.id}`);
    }
    if (filtros.username) {
      query.push(`username=${filtros.username}`);
    }
    if (filtros.email) {
      query.push(`email=${filtros.email}`);
    }

    const params = query.length > 0 ? '?' + query.join('&') : '';
    return this.getter<Cliente[]>(`clientes?${params}`).pipe(take(1));
  }

  public buscarTodosQuery2(filtros: any): Observable<Cliente[]> {
    const options = {
      params: this.parseObjectToHttpParams(filtros)
    };
    return this.getter<Cliente[]>('clientes', options).pipe(take(1));
  }

  public buscarPorId(id: number): Observable<Cliente> {
    return this.getter<Cliente>(`clientes/${id}`).pipe(take(1));
  }

  public salvar(cliente: Cliente): Observable<Cliente> {
    if (cliente.id) {
      cliente.dateUpdate = new Date();
      return this.put<Cliente>(`clientes/${cliente.id}`, cliente);
    } else {
      cliente.dateInsert = new Date();
      return this.post<Cliente>('clientes', cliente);
    }
  }

  public excluir(id: number): Observable<void> {
    return this.delete(`clientes/${id}`).pipe(take(1));
  }

}

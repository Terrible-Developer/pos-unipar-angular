import { FormControl } from '@angular/forms';
import { ClienteModalComponent } from './componentes/modal/cliente-modal/cliente-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from './models/cliente.model';
import { ClienteService } from './services/cliente.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[] = [];
  clientesSearch: Cliente[] = [];
  searchControl: FormControl = new FormControl();

  // Para todos os service que o componente for usar precisa ser injetado recebendo pelo construtor
  constructor(
    private toastr: ToastrService,
    private clienteService: ClienteService,
    private modalService: NgbModal
  ) {

    // pega os valueChange do campo de pesquisa, ai toda vez que o usuário digitar no campo irá cair e nós filtramos o usuário pelo nome
    // debounceTime(500) => cria um timeOut para entrar no subscribe apenas quando o usuário para de digitar após 0.5segundos
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os clientes
        this.filtrarClientes(value.toLocaleLowerCase());

      });
  }

  ngOnInit(): void {
    // Quando iniciar a tela carrega os usuários através da api
    this.carregaClientesFromApi();

  }

  private filtrarClientes(value: string): void {
    // Filtra os usuário e responde no array de usuários filtrados
    this.clientesSearch = this.clientes.filter(u =>
      // coloca o nome do usuário em minusculo para ignorar os maiusculos dos minusculos
      u.name.toLocaleLowerCase().includes(value)
    );
  }

  private carregaClientesFromApi(): void {
    // Chama o service de clientes para buscar todos
    //    .buscarTodos() retorna um Observable<Cliente[]>
    //    como a chamada é assincrona para capturar o resultado é preciso "se inscrever" para receber o retorno

    this.clienteService.buscarTodos()
      .subscribe(result => {
        // pega o retorno recebido pela api e joga na nossa lista de usuários
        this.clientes = result;

        // Chama a função para filtrar os usuários para trazer toda a lista
        this.filtrarClientes('');

      }, error => {
        // Deu erro na requisição
        this.toastr.error(error.message, 'Ops.');
      });
  }

  public abrirModal(cliente: Cliente | undefined): void {
    // Instancia o modal
    const modalRef = this.modalService.open(ClienteModalComponent, { size: 'lg' });

    // Passa o parâmetro do usuário para dentro
    modalRef.componentInstance.cliente = cliente;

    // Pega a resposta quando o usuário salvar no modal
    modalRef.componentInstance.onSave.subscribe((result: Cliente) => {
      this.toastr.success('Cliente salvo com sucesso!');

      if (!cliente?.id) {
        // Se não tiver id no usuário de entrada então é uma insert
        this.clientes.push(result);
      } else {
        // Remove o usuário anterior e insere o novo
        const idx = this.clientes.findIndex(u => u.id === result!.id);
        this.clientes.splice(idx, 1, result);
      }
      this.limpaPesquisa();
    });

    // Pega a resposta quando o usuário excluír no modal
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.toastr.success('Cliente excluído com sucesso!');

      // Acha o usuário no array inicial e demove ele
      const idx = this.clientes.findIndex(u => u.id === cliente!.id);
      this.clientes.splice(idx, 1);
      this.limpaPesquisa();
    });
  }

  private limpaPesquisa(): void {
    this.searchControl?.setValue('');
  }

}

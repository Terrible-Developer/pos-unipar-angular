import { validateAllFormFields } from './../../../../../shared/helpers/iu.helper';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from './../../../services/cliente.service';
import { Cliente } from './../../../models/cliente.model';
import { Component, createPlatform, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasErrors } from 'src/app/shared/helpers/iu.helper';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.scss']
})
export class ClienteModalComponent implements OnInit {

  // Parâmetro para receber o usuário como entrada
  @Input()
  cliente: Cliente | undefined;

  // Função para emitir de volta que o usuário for salvo (emite o novo usuário inserido/alterado)
  @Output()
  onSave: EventEmitter<Cliente> = new EventEmitter<Cliente>();

  // Função para emitir de volta que o usuário for excluído
  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  formGroup?: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.createForm(this.cliente || {} as Cliente);
  }

  createForm(cliente: Cliente) {
    this.formGroup = this.formBuilder.group({
      name: [
        cliente.name,
        Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      email: [
        cliente.email,
        Validators.compose([Validators.required, Validators.email])
      ],
      address: [
        cliente.address,
        Validators.compose([Validators.required])
      ]
    });
  }

  public salvar(): void {
    if (this.formGroup?.invalid) {
      this.toastr.error('Campos inválidos ou não preenchidos!');
      validateAllFormFields(this.formGroup);
      return;
    }

    // Pega as informações que estão no formGroup (que são os campos da tela)
    const clienteForm = this.formGroup?.getRawValue();
    // Faz o merge dos objeto usuário inicial com os campos alterados na tela
    const cliente = { ...this.cliente, ...clienteForm };

    // Chama o service para salvar na API
    this.clienteService.salvar(cliente)
      .subscribe(result => {
        // Emite o evento que salvou com sucesso e passa o usuário que retornou do serviço atualizado
        this.onSave.emit(result);

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });

  }

  public excluir(): void {
    this.clienteService.excluir(this.cliente!.id!).subscribe(() => {
      // Emite o evento que excluiu
      this.onDelete.emit();

      // Fecha o modal
      this.activeModal.close();
    }, error => {
      this.toastr.error(error.message);
    });
  }

  get username() {
    return this.formGroup?.get('username');
  }

  get name() {
    return this.formGroup?.get('name');
  }

  get address(){
    return this.formGroup?.get('address');
  }

  get email() {
    return this.formGroup?.get('email');
  }

  hasErrors = hasErrors;

}

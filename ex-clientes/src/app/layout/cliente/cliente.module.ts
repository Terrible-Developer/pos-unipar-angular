import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteComponent } from './cliente.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteModalComponent } from './componentes/modal/cliente-modal/cliente-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ClienteRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule
  ],
  declarations: [
    ClienteComponent,
    ClienteModalComponent
  ],
  entryComponents: [
    ClienteModalComponent
  ]
})
export class ClienteModule { }

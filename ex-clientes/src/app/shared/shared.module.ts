import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageValidControlComponent } from './message-valid-control/message-valid-control.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    MessageValidControlComponent
  ],
  exports: [
    MessageValidControlComponent
  ],
  entryComponents: [
    MessageValidControlComponent
  ]
})
export class SharedModule { }

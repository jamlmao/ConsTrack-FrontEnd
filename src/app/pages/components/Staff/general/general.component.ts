import { Component, EventEmitter,OnInit,Output} from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, RequiredValidator,ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import intlTelInput from 'intl-tel-input';
import { Observable, tap } from 'rxjs';


@Component({
  selector: 'app-general',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,FontAwesomeModule, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {
  @Output() close = new EventEmitter<void>();

  public materialform: FormGroup;
  isCheckAll: boolean = false;

  constructor(private fb: FormBuilder) {
    this.materialform = this.fb.group({
      tableRows: this.fb.array([], [Validators.required])
    });
    this.addRow();

  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      material: [''],
      qty: [''],
      cost:[''],
     
      ischecked: [false]
    });
  }

  get getFormControls() {
    const control = this.materialform.get('tableRows') as FormArray;
    return control;
  }

  addRow() {
    const control =  this.materialform.get('tableRows') as FormArray;
    control.push(this.createFormGroup());
  }

  checkAll(checkVal: boolean) {
    
    this.getFormControls.controls.forEach(formGroup => {
      formGroup.get('ischecked')?.setValue(checkVal);
    });
  }
  onStatusChange(event:any, index: number) {
    debugger
    if(event.target.value == 'deactive'){
      const control =  this.materialform.get('tableRows') as FormArray;
      control.controls[index].get('state')?.disable();
      control.controls[index].get('city')?.disable();
    } else {
      const control =  this.materialform.get('tableRows') as FormArray;
      control.controls[index].get('state')?.enable();
      control.controls[index].get('city')?.enable();
    }
  }

  removeEmployee(index:number) {
    const control =  this.materialform.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  onSaveForm() {
    const formValue = this.materialform.value;
    
  }
  
  closeModal() {
    this.close.emit();
  }
  onSubmit(): void {
    
  }
}

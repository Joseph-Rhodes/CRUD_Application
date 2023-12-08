import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent implements OnInit{
  taskForm: FormGroup;
  
  
  constructor(
    private _fb: FormBuilder, 
    private _taskService: TaskService, 
    private _dialogRef: MatDialogRef<AddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _coreService: CoreService
    ){
      this.taskForm = this._fb.group({
        title: new FormControl('',Validators.required),
        description: new FormControl('',Validators.required),
        deadline: new FormControl('',Validators.required),
        priority: new FormControl('',Validators.required)
      });
    }
    
    ngOnInit(): void {
      this.taskForm.patchValue(this.data);
    }
    
    

    
    
    onFormSubmit(){
      if(this.taskForm.valid){
        if(this.data){
          this._taskService.updateTask(this.data.id,this.taskForm.value).subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Task was successfully updated', 'Done');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err)
            }
            
          });
        }else{
          this._taskService.addTask(this.taskForm.value).subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Task added successfully', 'Done');
              this._dialogRef.close(true); 
            },
            error: (err: any) => {
              console.error(err)
            }            
          });          
        }        
      }
    }
  }
  
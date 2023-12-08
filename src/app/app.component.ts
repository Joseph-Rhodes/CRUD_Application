import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from './add-edit/add-edit.component';
import { TaskService } from './services/task.service';
import { error } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { privateDecrypt } from 'crypto';
import { CoreService } from './core/core.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'todoapp'
  displayedColumns: string[] = [
    'title', 
    'description', 
    'deadline', 
    'priority',
    'isComplete',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;
  
  
  
  constructor(
    private _dialog: MatDialog, 
    private _taskService: TaskService,
    private _coreService: CoreService
    ) {}
    
    ngOnInit(): void {
      this.getTaskList();
    }
    
    selection = new SelectionModel<any>(true, []);
    
    checkboxLabel(row?: any): string {
      return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'} row ${row.id}`; // Replace 'id' with the actual property of your row object
    }
    
    openAddEditForm(){
      const dialogRef = this._dialog.open(AddEditComponent);
      dialogRef.afterClosed().subscribe({
        
        next: (val) => {
          if(val){
            this.getTaskList();
          }
        },
      });
    }
    
    getTaskList(){
      this._taskService.getTaskList().subscribe({
        next: (res) => {
          res.forEach((task: { isComplete: boolean; }) => task.isComplete = false);
          this.dataSource = new MatTableDataSource(res);
        },
        error: (err) => {
          console.log(err);
        }
        
      })
    }
    
    deleteTask(id: number){
      this._taskService.deleteTask(id).subscribe({
        next: (res) => {
          this._coreService.openSnackBar('Task deleted successfulyl', 'Done');
          this.getTaskList();
        },
        error: console.log,
      });
    }
    
    updateAddEditForm(data: any){
      const dialogRef = this._dialog.open(AddEditComponent, {
        data,
      });
      dialogRef.afterClosed().subscribe({
        
        next: (val) => {
          if(val){
            this.getTaskList();
          }
        },
      });
    }
    
    
  }

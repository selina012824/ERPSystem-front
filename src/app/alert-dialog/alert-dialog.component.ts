import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatButton],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  readonly diaglogRef = inject(MatDialogRef<AlertDialogComponent>)
  readonly data = inject<any>(MAT_DIALOG_DATA)
  message!: string;

  ngOnInit(): void {

    this.message = this.data.message;

  }


  //取消
  closeDialog() {
    let returnMessage = "cancel"
    this.diaglogRef.close(returnMessage)
  }


  //確認
  sure() {
    let returnMessage = "sure"
    this.diaglogRef.close(returnMessage)
  }
}

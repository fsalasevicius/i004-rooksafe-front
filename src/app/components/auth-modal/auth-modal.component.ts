import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef  } from '@angular/material/dialog';
import { MaterialModule } from '@shared/material/material.module';
import { AuthFormData, AuthModalData } from '../../core/models/auth-form-data.interface'; 
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from 'src/app/services/auth-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule,MaterialModule,FormsModule,MatSnackBarModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {

  formData: AuthFormData = {
    email: '',
    password: '',
    name: undefined
  };

  isRegister: boolean = false;
  title: string = '';
  description: string = '';
  buttonText: string = 'Continuar';

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: AuthModalData, private _authService: AuthService, private _router: Router ,  public dialogRef: MatDialogRef<AuthModalComponent>,
  private _snackBar: MatSnackBar) {
    this.isRegister = data.isRegister;
    this.title = data.title;
    this.description = data.description;
    this.buttonText = data.buttonText;
  }

  onSubmit() {
    this.formSubmit.emit(this.formData);
  
    if (this.isRegister && this.formData.name) {
      this._authService.register_usuario(this.formData.email, this.formData.password, this.formData.name).subscribe(
        response => {
          this._snackBar.open('Registro exitoso!', 'Cerrar', {
            duration: 3000, 
            verticalPosition: 'top', 
          });
          if (this._authService.isRunningInBrowser()) {
            sessionStorage.setItem('token', response.token);
          }
          this.closeModal();
          this._router.navigate(['/']); 
        },
        error => {
          this._snackBar.open('Hubo un error en el registro', 'Cerrar', { duration: 3000 , verticalPosition: 'top' });
        }
      );
    } else if (!this.isRegister) {
      this._authService.login_usuario(this.formData.email, this.formData.password).subscribe(
        response => {
          this._snackBar.open('Ingreso exitoso!', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
          if (this._authService.isRunningInBrowser()) {
            sessionStorage.setItem('token', response.access);
            sessionStorage.setItem('refresh_token', response.refresh);
          }
          this._router.navigate(['/']); 
          this.closeModal();
        },
        error => {
          this._snackBar.open('Error al ingresar, revise sus credenciales', 'Cerrar', { duration: 3000 , verticalPosition: 'top' });
        }
      );
    }
  }
  changeForm() {
    this.isRegister = !this.isRegister;
    if (this.isRegister) {
      this.title = 'Registro de Usuarios';
      this.description = 'Ingresa tus datos para registrarte en la plataforma.';
      this.buttonText = 'Registrarme!';
    } else {
      this.title = 'Ingreso de Usuarios';
      this.description = 'Para acceder ingresa tu correo y contraseña';
      this.buttonText = 'Continuar';
    }
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  @Output() formSubmit = new EventEmitter<AuthFormData>(); 
}
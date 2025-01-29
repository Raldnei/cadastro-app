import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router'; // Importando RouterModule e RouterOutlet
import { CadastroComponent } from './cadastro/cadastro.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Importando RouterModule
    CadastroComponent, 
    EditarUsuarioComponent
  ],
  templateUrl: './app.component.html',  // Certifique-se de que o router-outlet está no HTML
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cadastro de Usuários';
}

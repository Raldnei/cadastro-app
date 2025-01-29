import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

export const routes: Routes = [
  { path: '', component: CadastroComponent }, // Rota de cadastro
  { path: 'editar/:cpf', component: EditarUsuarioComponent }, // Rota de edição
];

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

interface Usuario {
  nome: string;
  tipo: string;
  tamanhoPet: string;
  servico: string;
  valor: number;
  dataNascimento: string;
  telefone: string;
  cpf: string; // Alterado para string
}

@Component({
  standalone: true,
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  imports: [HttpClientModule, FormsModule, CommonModule],
  providers: [DatePipe] // Adicionando o DatePipe
})
export class CadastroComponent implements OnInit {
  usuario: Usuario = {
    nome: '',
    tipo: '',
    tamanhoPet: '',
    servico: '',
    valor: 0,
    cpf: '', // Alterado para string
    dataNascimento: '',
    telefone: ''
  };

  usuariosCadastrados: Usuario[] = [];
  valorExibicao: string = '';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/usuarios')
      .subscribe({
        next: (data) => {
          // Formata a data de nascimento antes de adicionar ao array
          this.usuariosCadastrados = data.map(user => {
            user.dataNascimento = this.datePipe.transform(user.data_nascimento, 'dd/MM/yyyy') || '';
            return user;
          });
          console.log('Usuários carregados:', this.usuariosCadastrados);
        },
        error: (error) => {
          console.error('Erro ao carregar os usuários:', error);
          alert('Erro ao carregar os usuários!');
        }
      });
  }

  setTamanhoPet(tamanho: string) {
    this.usuario.tamanhoPet = tamanho;
  }

  setTipoUsuario(tipo: string) {
    this.usuario.tipo = tipo;
  }

  setServico(servico: string) {
    this.usuario.servico = servico;
  }

  formatValor(event: any) {
    let valor = event.target.value.replace(/[^\d]/g, '');
    valor = valor.slice(0, 10);
    if (valor.length > 2) {
      valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    }
    if (valor.length > 6) {
      valor = valor.replace(/(\d)(\d{3}),(\d{2})$/, '$1.$2,$3');
    }
    this.valorExibicao = valor ? 'R$ ' + valor : '';
    this.usuario.valor = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  formatTelefone(event: any) {
    let telefone = event.target.value.replace(/\D/g, '');
    if (telefone.length > 11) {
      telefone = telefone.slice(0, 11);
    }
    if (telefone.length > 2) {
      telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
    }
    this.usuario.telefone = telefone;
  }

  formatarCpf(event: any) {
    let cpf = event.target.value.replace(/\D/g, ''); // Remove tudo o que não for número
    if (cpf.length <= 3) {
      cpf = cpf.replace(/(\d{1,3})/g, '$1');
    } else if (cpf.length <= 6) {
      cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
    event.target.value = cpf; 
    this.usuario.cpf = cpf; // Armazena o CPF formatado
  }

  isFormularioValido(): boolean {
    return (
      this.usuario.nome.trim() !== '' &&
      this.usuario.tipo.trim() !== '' &&
      this.usuario.cpf.trim().length === 14 && // Alterado para verificar string
      this.usuario.tamanhoPet.trim() !== '' &&
      this.usuario.servico.trim() !== '' &&
      this.usuario.valor > 0 &&
      this.usuario.dataNascimento.trim() !== '' &&
      this.usuario.telefone.trim() !== ''
    );
  }

  onSubmit() {
    if (!this.isFormularioValido()) {
      const camposVazios = [];

      if (!this.usuario.nome.trim()) camposVazios.push('Nome');
      if (!this.usuario.cpf.trim() || this.usuario.cpf.trim().length !== 14) camposVazios.push('CPF (deve ter 11 dígitos)');
      if (!this.usuario.tipo.trim()) camposVazios.push('Tipo de Usuário');
      if (!this.usuario.tamanhoPet.trim()) camposVazios.push('Tamanho do Pet');
      if (!this.usuario.servico.trim()) camposVazios.push('Serviço');
      if (this.usuario.valor <= 0) camposVazios.push('Valor do Serviço');
      if (!this.usuario.dataNascimento.trim()) camposVazios.push('Data de Nascimento');
      if (!this.usuario.telefone.trim()) camposVazios.push('Telefone');

      alert(`Preencha os seguintes campos antes de cadastrar:\n- ${camposVazios.join('\n- ')}`);
      return;
    }

    this.http.post('http://localhost:3000/cadastrar', this.usuario)
      .subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.carregarUsuarios(); // Atualiza a lista após cadastrar
        },
        error: () => {
          alert('CPF já cadastrado!');
        }
      });
  }
}

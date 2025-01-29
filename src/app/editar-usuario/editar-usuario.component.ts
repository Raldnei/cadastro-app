import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  tipo: string;
  tamanhoPet: string;
  servico: string;
  valor: number;
  nome: string;
  dataNascimento: string;
  telefone: string;
  cpf: string;
  
}

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  imports: [CommonModule, FormsModule] // Importe CommonModule e FormsModule
})
export class EditarUsuarioComponent {
  cpfBusca: string = '';
  usuario: Usuario | null = null;
  mensagem: string = '';
  valorExibicao: string = ''; // Para exibir o valor formatado

  constructor(private http: HttpClient) {}

  buscarUsuario() {
    if (!this.cpfBusca) {
      this.mensagem = 'Por favor, insira um CPF válido.';
      return;
    }

    this.http.get<Usuario>(`http://localhost:3000/usuarios/${this.cpfBusca}`)
      .subscribe(
        (data) => {
          this.usuario = data;
          this.mensagem = '';
        },
        (error) => {
          this.mensagem = 'Usuário não encontrado.';
          this.usuario = null;
        }
      );
  }

  salvarAlteracoes() {
    if (!this.usuario) {
      this.mensagem = 'Nenhum usuário carregado.';
      return;
    }

    this.http.put(`http://localhost:3000/editar-usuario/${this.usuario.cpf}`, this.usuario)
      .subscribe(
        (response: any) => {
          this.mensagem = response.message || 'Alterações salvas com sucesso!';
        },
        (error) => {
          this.mensagem = 'Erro ao salvar alterações.';
        }
      );
  }

  // Função para formatar o valor (ex: R$ 123.45)
  formatValor(event: any) {
    // Remove tudo que não é número
    let valor = event.target.value.replace(/[^\d]/g, '');
  
    // Se o campo estiver vazio, define o valor como "R$ 0,00"
    if (!valor) {
      event.target.value = 'R$ 0,00';
      this.usuario!.valor = 0;
      return;
    }
  
    // Limita o número de caracteres a 10
    valor = valor.slice(0, 10);
  
    // Adiciona zeros à esquerda se o valor for menor que 100 (para garantir duas casas decimais)
    if (valor.length < 3) {
      valor = valor.padStart(3, '0');
    }
  
    // Formata o valor com duas casas decimais
    const valorFormatado = (parseInt(valor) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    // Atualiza o valor exibido no campo de entrada
    event.target.value = valorFormatado;
  
  
  }
  // Função para formatar o telefone (ex: (XX) XXXXX-XXXX)
  formatTelefone(event: any) {
    let telefone = event.target.value.replace(/\D/g, ''); // Remove tudo o que não for número
    if (telefone.length > 11) {
      telefone = telefone.slice(0, 11); // Limita o tamanho a 11 caracteres
    }
    if (telefone.length > 2) {
      telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`; // Formata como telefone
    }
    this.usuario!.telefone = telefone; // Salva o telefone formatado
  }

  // Função para formatar o CPF (ex: XXX.XXX.XXX-XX)
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
    event.target.value = cpf; // Aplica a formatação no campo
    this.usuario!.cpf = cpf; // Salva o CPF formatado
  }
}

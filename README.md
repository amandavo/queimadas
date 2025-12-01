# 🔥 Projeto Queimadas

A proposta inclui tanto um protótipo simples de interface nova quanto melhorias de usabilidade.  
Este projeto tem como objetivo analisar dados reais de focos de queimadas e desenvolver uma interface web intuitiva, responsiva e funcional para a visualização dos dados do Programa Queimadas do INPE.  
Também consiste em implementar funcionalidades para filtrar, comparar e destacar informações relevantes sobre focos de queimadas.

## 🛰️ Sobre o Programa Queimadas – INPE

O Programa Queimadas, do Instituto Nacional de Pesquisas Espaciais (INPE), monitora e disponibiliza diariamente dados de focos de calor detectados por satélites.  
O objetivo é apoiar ações de prevenção, combate a incêndios florestais e análise de impacto ambiental.

## 🔧 Tecnologias

<a href="https://developer.mozilla.org/pt-BR/docs/Web/HTML" target="blank">
  <img align="center" src="https://img.shields.io/badge/HTML5-20232A?style=for-the-badge&logo=html5&logoColor=orange" alt="html"/>
</a>
<a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS" target="blank">
  <img align="center" src="https://img.shields.io/badge/CSS3-20232A?style=for-the-badge&logo=css3&logoColor=blue" alt="css"/>
</a>
<a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript" target="blank">
  <img align="center" src="https://img.shields.io/badge/JavaScript-20232A?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascript"/>
</a>
<a href="https://www.microsoft.com/pt-br/microsoft-365/excel" target="blank">
  <img align="center" src="https://img.shields.io/badge/Excel-20232A?style=for-the-badge&logo=microsoft-excel&logoColor=white" alt="excel"/>
</a>

## 📊 Planilhas Utilizadas

### **Focos**
- 10 últimos minutos  
- Do dia  
- Do mês  
- Anual  

### **Históricos**
- Brasil  
- São Paulo  

## ⚙️ Como Executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/amandavo/queimadas
   ```

2. Entre nesses caminhos:
    ```bash
    cd src
    cd cmd
    ```

3. Crie a venv:
    ```bash
    python -m venv venv
    ```

4. Ative o ambiente virtual (venv):

- No Windows, use:
  ```bash
  .\venv\Scripts\activate
  ```

- No Linux/macOS, use:
  ```bash
  source venv/bin/activate
  ```

5. Instale as dependências do requirements.txt:
    ```bash
    pip install -r requirements.txt
    ```

6. Rode o programa:
    ```bash
    python app.py
    ```

7. Acesse o link que aparecerá no cmd (http://127.0.0.1:5000/).
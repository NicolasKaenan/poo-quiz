import { useState, useMemo, useRef, useEffect } from "react";

// ─── PALETA ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#090b14",
  surface: "#10131f",
  card: "#13172a",
  border: "#1c2040",
  borderHover: "#2a3060",
  purple: "#7c6fff",
  purpleDim: "#3a3470",
  green: "#34d399",
  greenDim: "#0d2e22",
  red: "#f87171",
  redDim: "#2e0d0d",
  yellow: "#fbbf24",
  yellowDim: "#2e2000",
  blue: "#60a5fa",
  text: "#dde3f5",
  muted: "#8891b0",
  dim: "#3d4468",
};

// ─── BANCO DE QUESTÕES ────────────────────────────────────────────────────────
// type: "single" | "multi" | "fill" | "debug"

const QUESTIONS = [
  // ── MÚLTIPLA ESCOLHA (single) ──────────────────────────────────────
  {
    id: 1, type: "single", topic: "Pilares da POO",
    question: "Quais são os 4 pilares da Programação Orientada a Objetos?",
    options: [
      "Abstração, Encapsulamento, Herança e Polimorfismo",
      "Classe, Objeto, Método e Atributo",
      "Interface, Herança, Exceção e Composição",
      "Abstração, Modularidade, Reutilização e Generalização",
    ],
    correct: [0],
    explanation: "Os 4 pilares da POO são: Abstração (modelar o mundo real), Encapsulamento (ocultar detalhes internos), Herança (reutilizar e especializar) e Polimorfismo (tratar objetos diferentes de forma uniforme). Toda linguagem OO deve suportar esses quatro.",
  },
  {
    id: 2, type: "single", topic: "Encapsulamento",
    question: "O que o Encapsulamento garante na POO?",
    options: [
      "Que uma classe possa herdar de múltiplas superclasses",
      "Que detalhes internos de um objeto fiquem ocultos de outros objetos, expondo apenas o necessário",
      "Que métodos possam ter o mesmo nome com parâmetros diferentes",
      "Que subclasses reimplementem métodos das superclasses",
    ],
    correct: [1],
    explanation: "Encapsulamento oculta a implementação interna de um objeto. O motorista não precisa saber como o motor funciona — só precisa saber que acelerar() aumenta a velocidade. Isso isola responsabilidades e protege o estado interno, tornando a manutenção mais simples: mudanças internas não afetam quem usa o objeto.",
  },
  {
    id: 3, type: "single", topic: "Herança",
    question: "Em Java, qual palavra-chave indica que uma classe herda de outra?",
    options: ["implements", "extends", "inherits", "super"],
    correct: [1],
    explanation: "'extends' é a palavra-chave de herança em Java. Ex: 'public class Carro extends Veiculo'. Java permite apenas herança simples (uma classe estende apenas uma outra). 'super' referencia a superclasse dentro da subclasse. 'implements' é usado para interfaces, não herança de classe.",
  },
  {
    id: 4, type: "single", topic: "Polimorfismo",
    question: "Um Posto de Combustível consegue abastecer qualquer veículo (Carro ou Moto) sem precisar saber o tipo exato. Qual pilar da POO isso representa?",
    options: ["Abstração", "Encapsulamento", "Herança", "Polimorfismo"],
    correct: [3],
    explanation: "Polimorfismo: objetos de tipos diferentes (Carro, Moto) são tratados de forma genérica (como Veiculo). O posto chama abastecer(Veiculo v) e o comportamento correto é executado independente do tipo real. 'Poli' = muitas, 'morpho' = formas — o mesmo método, comportamentos diferentes.",
  },
  {
    id: 5, type: "single", topic: "Classes e Objetos",
    question: "Qual a relação correta entre Classe e Objeto?",
    options: [
      "Objeto é o molde; Classe é a instância criada a partir dele",
      "Classe é o molde/template; Objeto é uma instância concreta criada com 'new'",
      "São sinônimos — ambos representam a mesma coisa na memória",
      "Classe armazena apenas métodos; Objeto armazena apenas atributos",
    ],
    correct: [1],
    explanation: "Classe é o blueprint/molde que define estrutura (atributos + métodos). Objeto é uma instância concreta em memória criada com 'new'. Exemplo: a classe 'Carro' define cor, marca e acelerar(). Cada 'new Carro()' cria um objeto independente com seus próprios valores de atributos.",
  },
  {
    id: 6, type: "single", topic: "Modificadores de Acesso",
    question: "Qual modificador de acesso restringe o atributo para uso SOMENTE dentro da própria classe?",
    options: ["public", "protected", "private", "default (sem modificador)"],
    correct: [2],
    explanation: "'private' é o mais restritivo: só acessível dentro da própria classe. 'public' = qualquer lugar. 'protected' = mesma classe + subclasses + mesmo pacote. 'default' (sem modificador) = mesmo pacote. Para acessar atributos 'private' de fora, usamos getters/setters — isso é encapsulamento na prática.",
  },
  {
    id: 7, type: "single", topic: "Construtores",
    question: "O que caracteriza um Construtor em Java?",
    options: [
      "É um método void que destrói o objeto após o uso",
      "É um método estático que cria instâncias de outras classes",
      "É um método especial com o mesmo nome da classe, sem tipo de retorno, chamado automaticamente pelo 'new'",
      "É executado apenas uma vez quando a classe é carregada pela JVM",
    ],
    correct: [2],
    explanation: "Construtor: (1) mesmo nome da classe, (2) sem tipo de retorno — nem void, (3) chamado automaticamente com 'new'. Inicializa os atributos do objeto. Uma classe pode ter múltiplos construtores com parâmetros diferentes (sobrecarga de construtores). Se nenhum for definido, Java fornece um construtor padrão sem parâmetros.",
  },
  {
    id: 8, type: "single", topic: "Interfaces",
    question: "Em Java, para que serve uma Interface (contexto POO — não é UI/tela)?",
    options: [
      "Criar hierarquia de herança múltipla entre classes concretas",
      "Definir um contrato — lista de métodos que uma classe obrigatoriamente deve implementar",
      "Armazenar a implementação padrão de métodos para ser herdada por subclasses",
      "Inicializar objetos complexos substituindo o construtor",
    ],
    correct: [1],
    explanation: "Interface define um contrato: quais métodos existem, mas não como são implementados. Uma classe usa 'implements' para cumprir o contrato. Vantagem: uma classe pode implementar múltiplas interfaces (diferente de herança, que é simples em Java). Exemplo do material: interface 'RecebeValor' — Corretor e Proprietário implementam o método receber().",
  },
  {
    id: 9, type: "single", topic: "Classes Abstratas",
    question: "O que é verdadeiro sobre uma Classe Abstrata em Java?",
    options: [
      "Pode ser instanciada diretamente com 'new' normalmente",
      "Não pode conter métodos com implementação, apenas métodos abstratos",
      "É declarada com 'abstract class', não pode ser instanciada diretamente e pode ter métodos com ou sem implementação",
      "É equivalente a uma Interface, apenas com sintaxe diferente",
    ],
    correct: [2],
    explanation: "Classe Abstrata: declarada com 'abstract class', não pode ser instanciada diretamente (new ClasseAbstrata() gera erro). Pode misturar métodos abstratos (sem corpo — obrigatórios nas subclasses) e métodos concretos (com implementação completa). Exemplo do material: classes 'Pessoa' e 'Imóvel' são abstratas — servem de base para subclasses especializadas.",
  },
  {
    id: 10, type: "single", topic: "Relacionamento entre Classes",
    question: "Na UML, o losango PREENCHIDO (preto) representa qual tipo de relacionamento?",
    options: ["Agregação", "Composição", "Herança", "Realização (Interface)"],
    correct: [1],
    explanation: "Losango preto (preenchido) = Composição (dependência forte: o filho não existe sem o pai). Losango branco (vazio) = Agregação (dependência fraca: o filho pode existir independentemente). Seta com triângulo = Herança. Seta tracejada com triângulo = Realização/Interface. Exemplo: Banco ◆── Conta (composição); Pessoa ◇── Endereço (agregação).",
  },
  {
    id: 11, type: "single", topic: "Sobrescrita vs Sobrecarga",
    question: "Qual é a diferença entre Sobrescrita (Override) e Sobrecarga (Overloading)?",
    options: [
      "Sobrescrita ocorre na mesma classe com parâmetros diferentes; Sobrecarga ocorre em subclasses",
      "Sobrescrita é quando uma subclasse reimplementa um método herdado; Sobrecarga é quando a mesma classe tem métodos com o mesmo nome e parâmetros diferentes",
      "São a mesma coisa, apenas terminologias diferentes para o mesmo conceito",
      "Sobrescrita exige @Overload; Sobrecarga exige @Override",
    ],
    correct: [1],
    explanation: "SOBRESCRITA (Override): subclasse reimplementa um método da superclasse. Usa @Override. Mesmo nome, mesmos parâmetros, comportamento diferente. SOBRECARGA (Overloading): mesma classe, mesmo nome de método, mas parâmetros diferentes (tipo ou quantidade). Exemplo sobrecarga: calcularMedia() e calcularMedia(double p1, double p2). Exemplo sobrescrita: Apartamento.calcularAluguel() reimplementa Imovel.calcularAluguel().",
  },
  {
    id: 12, type: "single", topic: "Java & JVM",
    question: "O que é bytecode no Java e qual sua importância?",
    options: [
      "É o código fonte .java antes de ser compilado",
      "É código binário nativo gerado diretamente para o sistema operacional",
      "É um código intermediário gerado pelo javac (.class), executado pela JVM, tornando Java multiplataforma",
      "É o arquivo .jar empacotado para distribuição da aplicação",
    ],
    correct: [2],
    explanation: "Fluxo Java: código .java → compilador 'javac' → bytecode (.class) → JVM executa. O bytecode não é nativo de nenhum SO — é executado pela JVM. Isso realiza o slogan 'escreva uma vez, execute em qualquer lugar': o mesmo .class roda em Windows, Linux ou Mac, desde que tenha uma JVM instalada.",
  },
  {
    id: 13, type: "single", topic: "Tratamento de Exceções",
    question: "Qual bloco em Java SEMPRE é executado, com ou sem exceção?",
    options: ["try", "catch", "throw", "finally"],
    correct: [3],
    explanation: "'finally' sempre executa, independente de ocorrer exceção ou não. É usado para liberar recursos (fechar conexões, arquivos). 'try' = código que pode gerar exceção. 'catch' = só executa se houver exceção (captura e trata). 'throw' = lança uma exceção manualmente. 'throws' (com 's') = declara que um método pode lançar exceção.",
  },
  {
    id: 14, type: "single", topic: "Banco de Dados & JDBC",
    question: "Qual classe JDBC armazena os resultados de um SELECT e permite iterar linha por linha?",
    options: ["Connection", "Statement", "PreparedStatement", "ResultSet"],
    correct: [3],
    explanation: "ResultSet funciona como cursor sobre os resultados. rs.next() avança para a próxima linha (retorna false ao terminar). rs.getString('col'), rs.getInt('col') leem valores. Hierarquia: Connection (conexão com o banco) → Statement/PreparedStatement (executa SQL) → ResultSet (resultado do SELECT). PreparedStatement é preferido por ser seguro contra SQL Injection.",
  },
  {
    id: 15, type: "single", topic: "Manipulação de Arquivos",
    question: "Para ler um arquivo de texto linha por linha em Java, qual combinação é recomendada?",
    options: [
      "FileOutputStream + DataOutputStream",
      "FileReader + BufferedReader (método readLine())",
      "FileWriter + BufferedWriter",
      "Scanner + FileOutputStream",
    ],
    correct: [1],
    explanation: "FileReader lê caracteres de arquivo; BufferedReader adiciona buffer e o método readLine() que retorna a próxima linha (null ao terminar). Para ESCRITA: FileWriter + BufferedWriter. BufferedReader/Writer aumentam performance pois reduzem operações de I/O diretas no disco. Padrão: 'new BufferedReader(new FileReader(\"arquivo.txt\"))'.",
  },

  // ── MÚLTIPLAS CORRETAS (multi) ─────────────────────────────────────
  {
    id: 16, type: "multi", topic: "Pilares da POO",
    question: "Selecione TODAS as afirmações corretas sobre Herança em Java:",
    options: [
      "Java permite herança simples: uma classe só pode estender uma única classe",
      "Java permite herança múltipla de classes usando 'extends Classe1, Classe2'",
      "A palavra-chave 'super' pode chamar o construtor da superclasse dentro da subclasse",
      "Uma subclasse pode sobrescrever métodos herdados da superclasse",
      "Atributos 'private' da superclasse são herdados e acessíveis diretamente na subclasse",
    ],
    correct: [0, 2, 3],
    explanation: "Corretas: (A) Java só permite herança simples — 'extends UmaClasse'. (C) super() chama o construtor do pai; super.metodo() chama métodos do pai. (D) @Override permite que a subclasse reimplemente métodos herdados. ERRADAS: (B) Java NÃO tem herança múltipla de classes — use interfaces para isso. (E) Atributos private NÃO são acessíveis diretamente na subclasse — use protected ou getters/setters.",
  },
  {
    id: 17, type: "multi", topic: "Modificadores de Acesso",
    question: "Marque TODAS as afirmações corretas sobre modificadores de acesso:",
    options: [
      "'public' permite acesso de qualquer classe, em qualquer pacote",
      "'private' permite acesso na própria classe e em todas as subclasses",
      "'protected' permite acesso na própria classe, subclasses e classes do mesmo pacote",
      "Membros sem modificador (default) são acessíveis apenas dentro do mesmo pacote",
      "É boa prática declarar atributos como 'private' e fornecer getters/setters públicos",
    ],
    correct: [0, 2, 3, 4],
    explanation: "Corretas: (A) public = sem restrição de acesso. (C) protected = classe + subclasses + mesmo pacote. (D) default (sem modificador) = mesmo pacote apenas. (E) Prática padrão de encapsulamento. ERRADA: (B) 'private' é restrito à própria classe — subclasses NÃO acessam diretamente atributos private do pai.",
  },
  {
    id: 18, type: "multi", topic: "Interfaces",
    question: "Sobre Interfaces em Java, selecione TODAS as corretas:",
    options: [
      "Uma classe pode implementar múltiplas interfaces",
      "Uma classe pode estender múltiplas classes abstratas",
      "Interfaces tradicionais definem contratos sem fornecer implementação",
      "A palavra-chave para implementar uma interface é 'implements'",
      "Uma interface pode ser instanciada diretamente com 'new'",
    ],
    correct: [0, 2, 3],
    explanation: "Corretas: (A) Uma classe pode 'implements Interface1, Interface2, Interface3' — múltiplas interfaces permitidas. (C) Interface = contrato, sem implementação (Java 8+ permite 'default methods', mas a regra geral é sem implementação). (D) 'implements' é a palavra-chave correta. ERRADAS: (B) Java NÃO permite herdar múltiplas classes. (E) Interfaces não podem ser instanciadas diretamente.",
  },
  {
    id: 19, type: "multi", topic: "Tratamento de Exceções",
    question: "Selecione TODAS as afirmações corretas sobre Exceções em Java:",
    options: [
      "O bloco 'finally' executa sempre, mesmo se ocorrer uma exceção não capturada",
      "Podemos lançar uma exceção manualmente com 'throw new NomeDaExcecao()'",
      "Um método pode declarar que lança exceção usando 'throws' na sua assinatura",
      "O bloco 'catch' é obrigatório sempre que existe um 'try'",
      "É possível ter múltiplos blocos 'catch' para capturar diferentes tipos de exceção",
    ],
    correct: [0, 1, 2, 4],
    explanation: "Corretas: (A) 'finally' sempre executa — é sua garantia de limpeza de recursos. (B) 'throw new IOException()' lança exceção manualmente. (C) 'public void metodo() throws IOException' declara que pode lançar. (E) Múltiplos catch são permitidos e comuns: catch(IOException e) e catch(SQLException e). ERRADA: (D) 'catch' NÃO é obrigatório se houver 'finally' — try+finally é válido.",
  },
  {
    id: 20, type: "multi", topic: "Relacionamento entre Classes",
    question: "Sobre Composição e Agregação, marque TODAS as corretas:",
    options: [
      "Na Composição, o objeto filho não faz sentido existir sem o pai",
      "Na Agregação, os objetos podem existir de forma independente",
      "Composição é representada na UML por um losango branco (vazio)",
      "Um exemplo de Composição é Banco e ContaBancária",
      "Um exemplo de Agregação é Pessoa e Endereço",
    ],
    correct: [0, 1, 3, 4],
    explanation: "Corretas: (A) Composição = dependência forte: ContaBancária não existe sem Banco. (B) Agregação = dependência fraca: Endereço existe sem Pessoa. (D) Banco◆──Conta é composição — o banco cria e destrói as contas. (E) Pessoa◇──Endereço é agregação — o endereço pode existir sem a pessoa. ERRADA: (C) Composição usa losango PRETO (preenchido); Agregação usa losango BRANCO (vazio).",
  },
  {
    id: 21, type: "multi", topic: "Java & JVM",
    question: "Selecione TODAS as IDEs válidas para desenvolvimento Java mencionadas no material:",
    options: ["Eclipse", "Visual Studio Code", "IntelliJ IDEA", "PyCharm", "NetBeans"],
    correct: [0, 1, 2],
    explanation: "O material menciona: Eclipse (open source, gratuito, amplamente utilizado — escolhido para os exemplos), Visual Studio Code (gratuito, Microsoft, com plugins para Java) e IntelliJ IDEA (JetBrains, versão Community gratuita e Ultimate paga). PyCharm é focado em Python. NetBeans também é válido para Java mas não foi citado no material.",
  },

  // ── COMPLETAR LACUNA (fill) ────────────────────────────────────────
  {
    id: 22, type: "fill", topic: "Java & JVM",
    question: "Complete: Em Java, o código fonte (.java) é compilado pelo _____ para _____, que é executado pela _____.",
    blanks: ["javac", "bytecode", "JVM"],
    options: ["javac", "JVM", "bytecode", "JDK", "IDE", "javap"],
    explanation: "Fluxo completo: código .java → compilador 'javac' → bytecode (.class) → JVM (Java Virtual Machine) executa. O JDK (Java Development Kit) é o pacote que inclui o javac e outras ferramentas. A JVM converte o bytecode em instruções nativas do sistema operacional em tempo de execução.",
  },
  {
    id: 23, type: "fill", topic: "Pilares da POO",
    question: "Os 4 pilares da POO são: _____, _____, _____ e _____.",
    blanks: ["Abstração", "Encapsulamento", "Herança", "Polimorfismo"],
    options: ["Abstração", "Encapsulamento", "Herança", "Polimorfismo", "Composição", "Interface", "Sobrecarga"],
    explanation: "Os 4 pilares são: Abstração (modelar o mundo real), Encapsulamento (ocultar detalhes), Herança (reutilizar e especializar) e Polimorfismo (múltiplas formas). Composição, Interface e Sobrecarga são conceitos importantes da POO, mas não são considerados os 4 pilares fundamentais.",
  },
  {
    id: 24, type: "fill", topic: "Modificadores de Acesso",
    question: "Do mais restritivo ao menos restritivo, os modificadores de acesso em Java são: _____, _____, _____ e _____.",
    blanks: ["private", "default", "protected", "public"],
    options: ["private", "protected", "public", "default", "static", "final"],
    explanation: "Ordem crescente de acesso: private (só a classe) < default/sem modificador (mesmo pacote) < protected (pacote + subclasses) < public (qualquer lugar). 'static' e 'final' não são modificadores de acesso — 'static' define membros de classe e 'final' impede sobrescrita/herança.",
  },
  {
    id: 25, type: "fill", topic: "Herança",
    question: "Em Java, usamos _____ para herdar de uma classe e _____ para implementar uma interface.",
    blanks: ["extends", "implements"],
    options: ["extends", "implements", "inherits", "uses", "super", "interface"],
    explanation: "'extends' = herança de classe (apenas uma). 'implements' = implementar interface (pode ser múltiplas). Exemplo completo: 'public class Corretor extends Pessoa implements RecebeValor'. Uma classe pode combinar os dois: estender uma classe E implementar várias interfaces.",
  },
  {
    id: 26, type: "fill", topic: "Banco de Dados & JDBC",
    question: "No JDBC, _____ representa a conexão com o banco, _____ executa comandos SQL e _____ armazena resultados de SELECT.",
    blanks: ["Connection", "Statement", "ResultSet"],
    options: ["Connection", "Statement", "ResultSet", "PreparedStatement", "SQLException", "DriverManager"],
    explanation: "Connection = ponte com o banco de dados. Statement (ou PreparedStatement) = executa SQL. ResultSet = cursor sobre os resultados de SELECT. DriverManager cria a Connection. PreparedStatement é preferido ao Statement por ser seguro contra SQL Injection e aceitar parâmetros com '?'. SQLException é a exceção lançada em erros JDBC.",
  },

  // ── ACHE O ERRO (debug) ────────────────────────────────────────────
  {
    id: 27, type: "debug", topic: "Construtores",
    question: "Encontre o ERRO no código abaixo:",
    code: `public class Carro {
  private String modelo;
  private String cor;

  public void Carro(String modelo, String cor) {
    this.modelo = modelo;
    this.cor = cor;
  }
}`,
    options: [
      "Os atributos deveriam ser 'public', não 'private'",
      "O construtor não deveria ter o mesmo nome da classe",
      "O construtor não pode ter tipo de retorno — 'void' deve ser removido",
      "Falta o ponto-e-vírgula depois de 'this.modelo = modelo'",
    ],
    correct: [2],
    explanation: "Construtores em Java NÃO têm tipo de retorno — nem 'void'. Com 'void', o compilador trata isso como um método comum chamado 'Carro', não como construtor. O correto é: 'public Carro(String modelo, String cor) { ... }'. Se você escrever 'void', o objeto não terá construtor real e Java usará o construtor padrão (sem parâmetros) implicitamente.",
  },
  {
    id: 28, type: "debug", topic: "Herança",
    question: "Qual é o ERRO neste código?",
    code: `public class Animal {
  protected String nome;

  public void emitirSom() {
    System.out.println("Som genérico");
  }
}

public class Cachorro extends Animal, Mamifero {
  @Override
  public void emitirSom() {
    System.out.println("Au au!");
  }
}`,
    options: [
      "@Override não pode ser usado com herança",
      "Java não suporta herança múltipla de classes — 'extends Animal, Mamifero' é inválido",
      "O atributo 'nome' deveria ser 'private' na classe Animal",
      "O método emitirSom() não pode ser sobrescrito porque não é abstrato",
    ],
    correct: [1],
    explanation: "Java NÃO suporta herança múltipla de classes. 'extends Animal, Mamifero' gera erro de compilação. Para usar comportamentos de múltiplas origens, use interfaces: 'public class Cachorro extends Animal implements Mamifero'. @Override está correto e é sempre recomendado. Métodos concretos (não abstratos) também podem ser sobrescritos.",
  },
  {
    id: 29, type: "debug", topic: "Encapsulamento",
    question: "Qual problema existe neste código?",
    code: `public class ContaBancaria {
  public double saldo;
  public String titular;

  public void depositar(double valor) {
    saldo += valor;
  }

  public void sacar(double valor) {
    saldo -= valor;
  }
}

// Em outro lugar:
conta.saldo = -99999;`,
    options: [
      "O método depositar() está errado — deveria multiplicar, não somar",
      "Os atributos 'public' violam o Encapsulamento: qualquer código pode modificar 'saldo' diretamente, sem validação",
      "A classe deveria ser abstrata para funcionar corretamente",
      "Não há nenhum erro — atributos public são a melhor prática em Java",
    ],
    correct: [1],
    explanation: "Atributos 'public' violam o Encapsulamento. Com 'saldo' público, qualquer código pode fazer 'conta.saldo = -99999' sem passar pelas regras de negócio. O correto é 'private double saldo' com métodos depositar()/sacar() que validam (ex: não permitir saldo negativo). Assim, o controle fica dentro da classe — o objeto controla seu próprio estado.",
  },
  {
    id: 30, type: "debug", topic: "Interfaces",
    question: "Encontre o ERRO no código abaixo:",
    code: `public interface Veiculo {
  int velocidadeMaxima = 200;

  void acelerar();
  void frear();

  void ligar() {
    System.out.println("Veículo ligado");
  }
}`,
    options: [
      "Interfaces não podem ter atributos — 'velocidadeMaxima' é inválido",
      "Métodos em interfaces não podem ter parâmetros",
      "Interfaces tradicionais não podem ter métodos com implementação (corpo) — 'ligar()' deveria ser abstrato (sem corpo) ou usar 'default'",
      "Os métodos acelerar() e frear() deveriam ter tipo de retorno 'void' explícito",
    ],
    correct: [2],
    explanation: "Em interfaces tradicionais Java, métodos não podem ter implementação. 'ligar() { ... }' com corpo é inválido sem a palavra 'default'. Correto: 'default void ligar() { ... }' (Java 8+) ou remover o corpo: 'void ligar();'. Atributos em interfaces são implicitamente 'public static final' (constantes) — então 'velocidadeMaxima' é válido. acelerar() e frear() estão corretos como abstratos.",
  },
  {
    id: 31, type: "debug", topic: "Classes Abstratas",
    question: "O que está ERRADO neste código?",
    code: `public abstract class Forma {
  public abstract double calcularArea();
}

// Em outro arquivo:
Forma f = new Forma();
System.out.println(f.calcularArea());`,
    options: [
      "Métodos abstratos não podem retornar 'double'",
      "Classes abstratas não podem ter métodos abstratos",
      "Não é possível instanciar diretamente uma classe abstrata com 'new Forma()'",
      "A classe Forma deveria implementar uma interface para funcionar",
    ],
    correct: [2],
    explanation: "Classes abstratas NÃO podem ser instanciadas diretamente. 'new Forma()' gera erro de compilação. O correto é criar uma subclasse concreta: 'public class Circulo extends Forma { public double calcularArea() { return Math.PI * raio * raio; } }' e então 'Forma f = new Circulo(5)'. Classes abstratas existem para ser base, não para ser instanciadas.",
  },

  // EXTRA single e multi para variedade
  {
    id: 32, type: "single", topic: "Java & JVM",
    question: "Qual empresa criou o Java e quem detém os direitos atualmente?",
    options: [
      "Microsoft criou; ainda mantém os direitos",
      "Sun Microsystems criou em 1991; Oracle adquiriu em 2010",
      "IBM criou; Apache Foundation mantém",
      "Google criou para Android; mantém até hoje",
    ],
    correct: [1],
    explanation: "O Java foi criado pela Sun Microsystems em 1991, projeto liderado por James Gosling. Em 2010, a Oracle adquiriu a Sun e com ela o Java. O objetivo original era 'escreva uma vez, execute em qualquer lugar' — viabilizado pela JVM. Hoje é usado em sistemas empresariais de grande porte, Web e Android.",
  },
  {
    id: 33, type: "single", topic: "Relacionamento entre Classes",
    question: "A multiplicidade '0..*' em um diagrama UML significa:",
    options: [
      "Exatamente zero objetos",
      "Pelo menos um objeto",
      "Zero ou mais objetos (nenhum ou vários)",
      "No máximo dois objetos",
    ],
    correct: [2],
    explanation: "'0..*' = zero ou mais: o relacionamento é opcional e sem limite máximo. Outras: '1' = exatamente um; '1..*' = um ou mais (obrigatório pelo menos um); '0..1' = zero ou um (opcional, máximo um); '1..5' = entre 1 e 5. No material: um Banco pode ter '0..*' contas (pode não ter nenhuma). Uma Conta pertence a exatamente '1' banco.",
  },
  {
    id: 34, type: "multi", topic: "Classes Abstratas",
    question: "Selecione TODAS as diferenças corretas entre Classe Abstrata e Interface:",
    options: [
      "Classe Abstrata pode ter métodos concretos (com implementação); Interface tradicional não",
      "Uma classe pode implementar múltiplas interfaces, mas estender apenas uma classe abstrata",
      "Interface pode ser instanciada diretamente; Classe Abstrata não",
      "Atributos em interfaces são implicitamente public, static e final (constantes)",
      "Classe Abstrata usa 'implements'; Interface usa 'extends'",
    ],
    correct: [0, 1, 3],
    explanation: "Corretas: (A) Classe Abstrata mistura métodos concretos e abstratos; interface tradicional só abstratos. (B) Herança simples vs múltiplas interfaces. (D) Atributos de interface são constantes: 'public static final' implicitamente. ERRADAS: (C) Interface também NÃO pode ser instanciada diretamente. (E) Invertido: usa 'extends' para classe abstrata e 'implements' para interface.",
  },

  // ── QUESTÕES DA LISTA E PROVA (nível avançado) ────────────────────

  // --- debug ---
  {
    id: 35, type: "debug", topic: "Ache o Erro (Java)",
    question: "O programa abaixo sempre imprime 'A distancia e: 1.0' independente dos valores digitados. Onde está o defeito?",
    code: `distancia = Math.pow(
  Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2),
  1/2
);`,
    options: [
      "Math.pow deveria ser substituído pelo operador ** do Java",
      "x2-x1 e y2-y1 precisam de parênteses extras para subtrair corretamente",
      "1/2 é uma divisão inteira em Java e resulta em 0, não 0.5 — Math.pow(..., 0) sempre retorna 1.0",
      "Math.pow não aceita dois argumentos quando o segundo é uma fração",
    ],
    correct: [2],
    explanation: "O problema é '1/2': como ambos são literais inteiros, Java realiza divisão inteira, resultando em 0 (não 0.5). Math.pow(x, 0) sempre retorna 1.0. A correção é usar '1.0/2' ou '0.5' como expoente: Math.pow(..., 0.5). Alternativamente, use Math.sqrt() que é mais legível e direto para raiz quadrada.",
  },
  {
    id: 36, type: "debug", topic: "Ache o Erro (Java)",
    question: "Qual dos programas abaixo IMPRIME o código -1 antes de encerrar (comportamento incorreto)?",
    code: `// Programa A: lê ANTES do while, imprime dentro
while (codigo != -1) {
  System.out.println("Código: " + codigo);
  codigo = teclado.nextInt();
}

// Programa B: lê E imprime dentro do do-while
do {
  codigo = teclado.nextInt();
  System.out.println("Código: " + codigo);
} while (codigo != -1);`,
    options: [
      "Programa A — porque lê fora do loop e o -1 nunca é verificado",
      "Programa B — porque imprime o código ANTES de verificar a condição de parada",
      "Ambos têm o comportamento correto",
      "Nenhum dos dois, pois while e do-while se comportam identicamente",
    ],
    correct: [1],
    explanation: "No Programa B (do-while), a sequência é: lê o código → imprime → verifica. Quando o usuário digita -1, ele é IMPRESSO antes da verificação encerrar o loop. O Programa A é correto: lê fora, verifica antes de imprimir, lê de novo no final do loop — o -1 nunca é impresso porque a condição é checada antes de entrar no corpo do while.",
  },
  {
    id: 37, type: "debug", topic: "Ache o Erro (Java)",
    question: "Analise este código de tratamento de exceção. O que está ERRADO?",
    code: `try {
  int resultado = 10 / 0;
  System.out.println(resultado);
} catch (Exception e) {
  System.out.println("Erro genérico: " + e.getMessage());
} catch (ArithmeticException e) {
  System.out.println("Divisão por zero!");
} finally {
  System.out.println("Finalizado.");
}`,
    options: [
      "O bloco finally não pode aparecer depois de múltiplos catch",
      "ArithmeticException não existe em Java — o correto é MathException",
      "catch(Exception e) captura TUDO — o catch(ArithmeticException e) depois nunca será alcançado; erro de compilação por bloco inacessível",
      "try sem recursos não pode ter finally — é necessário try-with-resources",
    ],
    correct: [2],
    explanation: "Em Java, os blocos catch devem ser ordenados do mais específico para o mais genérico. Exception é superclasse de ArithmeticException — ao colocar catch(Exception e) primeiro, ele captura qualquer exceção, tornando o catch(ArithmeticException e) inacessível (unreachable). O compilador Java detecta isso como erro. A ordem correta: catch(ArithmeticException e) primeiro, depois catch(Exception e).",
  },

  // --- single ---
  {
    id: 38, type: "single", topic: "Coesão e Acoplamento",
    question: "O que é 'acoplamento' no contexto de design de software orientado a objetos?",
    options: [
      "A capacidade de um método realizar múltiplas tarefas ao mesmo tempo",
      "A vinculação/dependência entre unidades separadas do programa (classes, módulos)",
      "O número de atributos que uma classe possui internamente",
      "A técnica de ocultar os detalhes de implementação com modificadores de acesso",
    ],
    correct: [1],
    explanation: "Acoplamento se refere ao grau de dependência/vinculação entre unidades separadas (classes, módulos). Acoplamento FRACO (baixo) é o desejável: permite entender e modificar uma classe sem precisar ler ou alterar outras. Acoplamento FORTE (alto) é indesejável: mudanças em uma classe 'quebram' outras que dependem dela. Não confunda com coesão, que se refere às responsabilidades dentro de uma única unidade.",
  },
  {
    id: 39, type: "single", topic: "Coesão e Acoplamento",
    question: "Qual das alternativas descreve a meta correta de design para sistemas OO robustos?",
    options: [
      "Alta coesão e acoplamento forte",
      "Baixa coesão e acoplamento fraco",
      "Alta coesão e acoplamento fraco",
      "Baixa coesão e acoplamento forte",
    ],
    correct: [2],
    explanation: "A meta é ALTA COESÃO + ACOPLAMENTO FRACO. Alta coesão: cada classe tem uma responsabilidade clara e bem definida (faz uma coisa, faz bem). Acoplamento fraco: as classes dependem pouco umas das outras. Juntos, esses princípios tornam o sistema mais fácil de entender, testar, manter e evoluir. É a base dos princípios SOLID.",
  },
  {
    id: 40, type: "single", topic: "Coesão e Acoplamento",
    question: "Por que acoplamento FRACO é desejável? (Questão baseada em prova real — UNICAP 2007)",
    options: [
      "Porque permite instanciar classes abstratas diretamente",
      "Porque elimina a necessidade de usar interfaces no projeto",
      "Porque permite entender e modificar uma classe sem precisar ler ou alterar outras classes",
      "Porque aumenta o desempenho em tempo de execução ao reduzir chamadas de método",
    ],
    correct: [2],
    explanation: "Acoplamento fraco isola as classes entre si. Se a classe A não depende dos detalhes internos da classe B, você pode modificar B sem afetar A. Isso é fundamental para manutenção: em sistemas com acoplamento forte, uma mudança simples pode cascatear por dezenas de classes. Acoplamento fraco é alcançado usando interfaces, injeção de dependência e respeitando o princípio de 'fale apenas com seus vizinhos imediatos'.",
  },
  {
    id: 41, type: "single", topic: "Tratamento de Exceções",
    question: "Sobre a cláusula 'finally' em Java, qual afirmação é INCORRETA? (Baseada em prova real — UNICAP 2007)",
    options: [
      "O bloco finally sempre executa, mesmo se uma exceção for lançada e não capturada",
      "O bloco finally é executado mesmo quando há um 'return' dentro do bloco try",
      "A cláusula finally pode ser substituída simplesmente colocando o código na linha após o bloco try-catch, com o mesmo efeito",
      "O bloco finally é ideal para fechar recursos como conexões e arquivos",
    ],
    correct: [2],
    explanation: "Esta é uma pegadinha clássica de prova! Código após o try-catch SÓ executa se nenhuma exceção não capturada for lançada. Se uma exceção escapar do try-catch, o código após o bloco é ignorado. Já o 'finally' executa SEMPRE — mesmo com exceções não capturadas, mesmo com 'return' dentro do try. São comportamentos completamente diferentes. O finally é a única garantia real de execução.",
  },
  {
    id: 42, type: "single", topic: "Tratamento de Exceções",
    question: "Ao lançar uma exceção com 'throw', o que passamos como parâmetro? (Baseada em prova real — UNICAP 2007)",
    options: [
      "O nome de uma classe de exceção (ex: throw ArithmeticException)",
      "Um objeto/instância de uma classe de exceção (ex: throw new ArithmeticException('msg'))",
      "Um código de erro numérico inteiro (ex: throw 404)",
      "Uma string com a mensagem de erro (ex: throw 'Erro de divisão')",
    ],
    correct: [1],
    explanation: "Com 'throw' passamos um OBJETO (instância) de uma classe de exceção, não a classe em si. A sintaxe correta é: 'throw new NomeDaExcecao(\"mensagem\")'. O 'new' cria a instância. Isso é importante: a exceção é um objeto que carrega informações (mensagem, stack trace). A questão da prova UNICAP 2007 pegava quem confundia 'passar uma classe' com 'passar um objeto da classe'.",
  },
  {
    id: 43, type: "single", topic: "Tratamento de Exceções",
    question: "Qual a diferença entre Exception e Error em Java?",
    options: [
      "São sinônimos — ambos representam falhas que podem ser capturadas com catch",
      "Exception representa condições anormais que o programa pode tratar; Error representa problemas graves da JVM que geralmente NÃO devem ser capturados",
      "Error é para erros de lógica do programador; Exception é para erros de hardware",
      "Exception só pode ser lançada pelo programador; Error só pela JVM",
    ],
    correct: [1],
    explanation: "Hierarquia: Throwable → Exception (tratável) / Error (não tratável). Exception: situações anormais que o código pode e deve tratar (IOException, SQLException, NullPointerException). Error: problemas graves da JVM — StackOverflowError, OutOfMemoryError — que indicam falha crítica do sistema e geralmente não devem ser capturados (a JVM não consegue se recuperar). RuntimeException é subclasse de Exception mas é unchecked (não obriga try-catch).",
  },
  {
    id: 44, type: "single", topic: "Classes Abstratas",
    question: "Por que uma classe abstrata NÃO pode ser instanciada? (Questão de prova real — UNICAP 2007)",
    options: [
      "Por limitação técnica da JVM que não aloca memória para classes com 'abstract'",
      "Porque classes abstratas não têm construtor, então 'new' não funciona",
      "Porque ela pode conter métodos abstratos (sem implementação) — instanciar seria criar um objeto 'incompleto' com métodos sem corpo",
      "Por convenção de boas práticas, mas tecnicamente seria possível instanciar",
    ],
    correct: [2],
    explanation: "Classes abstratas podem conter métodos abstratos — declarados mas sem implementação (sem corpo). Instanciar tal classe criaria um objeto 'quebrado': chamar um método abstrato não teria código para executar. O compilador proíbe 'new ClasseAbstrata()' para evitar esse estado inválido. As subclasses concretas DEVEM implementar todos os métodos abstratos antes de poder ser instanciadas. Obs: classes abstratas CAN têm construtores — eles são chamados via super() nas subclasses.",
  },
  {
    id: 45, type: "single", topic: "Classes Abstratas",
    question: "Por que não podemos declarar um CONSTRUTOR como 'abstract'?",
    options: [
      "Porque construtores não têm tipo de retorno, e 'abstract' exige tipo de retorno void",
      "Porque construtores não são herdados e nunca são sobrescritos — abstract só faz sentido para métodos que subclasses vão implementar",
      "Porque 'abstract' e 'public' não podem coexistir na mesma declaração",
      "Porque construtores abstratos causariam ambiguidade no uso de 'new'",
    ],
    correct: [1],
    explanation: "O modificador 'abstract' em um método significa que subclasses devem sobrescrevê-lo (dar implementação). Construtores nunca são herdados nem sobrescritos — cada classe tem os seus próprios. Não existe o conceito de 'sobrescrever um construtor'. Portanto, 'abstract' em construtor não teria sentido semântico. O compilador rejeita 'abstract' em construtores por essa razão.",
  },
  {
    id: 46, type: "single", topic: "Herança",
    question: "Ao usar 'implements' em Java para uma interface, o que estamos criando?",
    options: [
      "Uma herança de código — a classe herda a implementação dos métodos da interface",
      "Um subtipo da interface, mas SEM herança de código — a classe apenas cumpre o contrato",
      "Uma composição — a interface se torna um atributo interno da classe",
      "Uma sobrecarga — os métodos da interface são sobrecarregados na classe",
    ],
    correct: [1],
    explanation: "Ao implementar uma interface, criamos um SUBTIPO (a classe 'é um' tipo da interface para fins de polimorfismo), mas NÃO há herança de código — interfaces tradicionais não têm implementação para herdar. A classe precisa escrever 100% do código de cada método. Isso é diferente de 'extends' de uma classe abstrata, que SIM herda código dos métodos concretos. Esta distinção apareceu diretamente na prova UNICAP 2007.",
  },
  {
    id: 47, type: "single", topic: "Coleções Java",
    question: "Qual a principal vantagem de usar List (ArrayList) em vez de array simples em Java?",
    options: [
      "List é mais rápida que array para qualquer operação de leitura",
      "List tem tamanho fixo definido em tempo de compilação, mais seguro",
      "List tem crescimento dinâmico e métodos prontos (add, remove, size) — array tem tamanho fixo definido na criação",
      "List permite armazenar tipos primitivos diretamente (int, double) sem autoboxing",
    ],
    correct: [2],
    explanation: "Array em Java: tamanho fixo definido na criação ('new int[10]'), acesso por índice direto, suporta primitivos. ArrayList/List: tamanho dinâmico (cresce/encolhe automaticamente), métodos prontos (add(), remove(), contains(), size(), sort()), mas só aceita objetos (Integer, não int — usa autoboxing). Para a maioria dos casos práticos, List é mais conveniente. Arrays ainda são preferidos quando o tamanho é conhecido e performance é crítica.",
  },
  {
    id: 48, type: "single", topic: "Coleções Java",
    question: "Quando usar Map em vez de List para armazenar dados em Java?",
    options: [
      "Quando os dados precisam ser ordenados por índice numérico sequencial (0, 1, 2...)",
      "Quando precisamos associar pares chave-valor e buscar pelo valor da chave rapidamente (ex: 'X' → 10, 'V' → 5)",
      "Quando precisamos garantir que não haja elementos duplicados na coleção",
      "Map é apenas um apelido para HashMap — são a mesma estrutura",
    ],
    correct: [1],
    explanation: "Map armazena pares chave-valor (key-value). Ex prático da lista de exercícios: tradução de decimal para romano — Map<Integer, String> onde 1→'I', 5→'V', 10→'X'. Busca por chave é O(1) no HashMap. List mantém elementos em sequência com índice numérico. Set garante unicidade. A escolha da coleção certa é fundamental: Map para lookup por chave, List para sequências, Set para conjuntos sem duplicatas.",
  },

  // --- multi ---
  {
    id: 49, type: "multi", topic: "Coesão e Acoplamento",
    question: "Sobre acoplamento em POO, marque TODAS as afirmações corretas: (Baseado em prova UNICAP 2007)",
    options: [
      "Acoplamento se refere à vinculação/dependência entre unidades separadas do programa",
      "Acoplamento fraco permite entender uma classe sem precisar ler outras classes",
      "O objetivo ideal de design é atingir acoplamento forte para maximizar reuso",
      "Alta coesão e acoplamento fraco devem ser buscados simultaneamente",
      "Acoplamento forte torna a manutenção mais difícil pois mudanças se propagam",
    ],
    correct: [0, 1, 3, 4],
    explanation: "Corretas: (A) Acoplamento = dependência entre unidades. (B) Acoplamento fraco = classes independentes, mais fáceis de entender isoladamente. (D) Alta coesão + acoplamento fraco é a dupla ideal. (E) Acoplamento forte cria efeito cascata em mudanças. ERRADA: (C) O objetivo é acoplamento FRACO, não forte. Acoplamento forte é um code smell — sinal de design ruim.",
  },
  {
    id: 50, type: "multi", topic: "Tratamento de Exceções",
    question: "Selecione TODAS as afirmações CORRETAS sobre RuntimeException em Java:",
    options: [
      "RuntimeException é subclasse de Exception",
      "Métodos que podem lançar RuntimeException NÃO são obrigados a declarar 'throws' ou usar try-catch",
      "NullPointerException e ArrayIndexOutOfBoundsException são exemplos de RuntimeException",
      "RuntimeException deve sempre ser capturada com try-catch — é obrigatório por lei da linguagem",
      "RuntimeException representa erros de lógica do programador que poderiam ser evitados",
    ],
    correct: [0, 1, 2, 4],
    explanation: "Corretas: (A) RuntimeException extends Exception extends Throwable. (B) São 'unchecked exceptions' — o compilador NÃO obriga try-catch ou throws. (C) NullPointerException (acessar null), ArrayIndexOutOfBoundsException (índice inválido), ClassCastException são RuntimeExceptions clássicas. (E) Geralmente indicam bugs: acessar objeto null, dividir por zero, índice fora do array — erros que o programador deveria prevenir. ERRADA: (D) Exatamente o oposto — unchecked = NÃO obrigado a capturar.",
  },
  {
    id: 51, type: "multi", topic: "Coleções Java",
    question: "Sobre as coleções Java (List, Set, Map), selecione TODAS as corretas:",
    options: [
      "List mantém a ordem de inserção e permite elementos duplicados",
      "Set não permite elementos duplicados — tentativas de inserir duplicatas são ignoradas",
      "HashMap garante que os elementos sejam retornados na ordem de inserção",
      "Map.get(chave) retorna null se a chave não existir no mapa",
      "ArrayList é a implementação mais comum de List e tem acesso O(1) por índice",
    ],
    correct: [0, 1, 3, 4],
    explanation: "Corretas: (A) List (ArrayList, LinkedList) = ordenada por índice, permite duplicatas. (B) Set (HashSet, TreeSet) = sem duplicatas — equals() é usado para verificar. (D) Map.get() retorna null para chave inexistente — sempre verifique antes de usar. (E) ArrayList: get(i) é O(1) (acesso direto). ERRADA: (C) HashMap NÃO garante ordem — use LinkedHashMap para manter ordem de inserção ou TreeMap para ordem de chave.",
  },

  // --- fill ---
  {
    id: 52, type: "fill", topic: "Coesão e Acoplamento",
    question: "Complete: O design ideal busca _____ coesão e acoplamento _____, enquanto o pior cenário é _____ coesão e acoplamento _____.",
    blanks: ["alta", "fraco", "baixa", "forte"],
    options: ["alta", "fraco", "baixa", "forte", "média", "moderado"],
    explanation: "Alta coesão: cada classe tem responsabilidade única e bem definida. Acoplamento fraco: classes são independentes entre si. Baixa coesão + acoplamento forte é o pior cenário: classes fazem tudo (God Class) e dependem umas das outras fortemente — qualquer mudança quebra o sistema inteiro.",
  },
  {
    id: 53, type: "fill", topic: "Tratamento de Exceções",
    question: "Em Java, _____ exceções devem ser declaradas com 'throws' ou capturadas (checked). Já _____ exceções não obrigam isso (unchecked). A superclasse de todas as exceções tratáveis é _____.",
    blanks: ["checked", "unchecked", "Exception"],
    options: ["checked", "unchecked", "Exception", "Error", "RuntimeException", "Throwable"],
    explanation: "Checked exceptions (IOException, SQLException): o compilador OBRIGA tratamento — ou try-catch ou declarar 'throws' na assinatura. Unchecked = RuntimeException e subclasses: o compilador não obriga. Exception é a superclasse de todas as exceções tratáveis (checked + unchecked). Error fica em outra hierarquia (problemas graves da JVM). Throwable é a raiz de tudo (Exception + Error).",
  },
  {
    id: 54, type: "fill", topic: "Coleções Java",
    question: "As três principais interfaces de coleção em Java são _____ (sequência ordenada), _____ (sem duplicatas) e _____ (pares chave-valor).",
    blanks: ["List", "Set", "Map"],
    options: ["List", "Set", "Map", "Array", "Queue", "Stack"],
    explanation: "List: sequência ordenada por índice, permite duplicatas (ArrayList, LinkedList). Set: conjunto sem elementos repetidos (HashSet, TreeSet). Map: dicionário de pares chave→valor, chaves únicas (HashMap, TreeMap). Queue é outra interface (fila — FIFO). Stack é uma classe (pilha — LIFO). Array não é parte do framework Collections — é uma estrutura de tamanho fixo da linguagem.",
  },

  // --- single avançado (Padrão Composite — prova UNICAP) ---
  {
    id: 55, type: "single", topic: "Padrão de Projeto",
    question: "A questão 6 da prova UNICAP 2007 pede equipamentos 'atômicos' e 'compostos' onde o preço do composto é a soma das partes. Qual padrão de projeto isso representa?",
    options: [
      "Strategy — define família de algoritmos intercambiáveis",
      "Observer — notifica dependentes sobre mudanças de estado",
      "Composite — trata objetos individuais e composições de objetos de forma uniforme",
      "Singleton — garante que uma classe tenha apenas uma instância",
    ],
    correct: [2],
    explanation: "O padrão Composite (GoF) trata objetos individuais (folhas/atômicos) e composições (galhos/compostos) de forma uniforme através de uma interface comum. No problema da prova: interface/classe abstrata Equipamento com getDescricao() e getPreco(). EquipamentoAtomico tem preco como atributo. EquipamentoComposto soma getPreco() de todas as suas partes (que podem ser atômicas ou compostas — recursivo). É exatamente o Composite Pattern.",
  },
  {
    id: 56, type: "single", topic: "Padrão de Projeto",
    question: "Na arquitetura em camadas mencionada na prova UNICAP 2007, qual é o papel da camada 'Fachada' (Facade)?",
    options: [
      "Armazenar os dados em estruturas como arrays ou banco de dados",
      "Representar a interface gráfica com a qual o usuário interage",
      "Fornecer uma interface simplificada para o subsistema, escondendo sua complexidade interna",
      "Controlar o fluxo de operações coordenando chamadas entre camadas",
    ],
    correct: [2],
    explanation: "Fachada (Facade Pattern): fornece interface simplificada para um conjunto complexo de classes/subsistema. Na arquitetura em camadas: Aplicação (UI/entry point) → Fachada (simplifica acesso ao domínio) → Controlador (coordena operações de negócio) → RepositórioArray (persistência dos dados). A Fachada isola a camada de apresentação dos detalhes internos do domínio — mudanças internas não afetam quem usa a Fachada.",
  },
  {
    id: 57, type: "single", topic: "Threads",
    question: "Qual a diferença entre os Programas A e B com threads? (Baseado na lista de exercícios)",
    code: `// Programa A: inicia todas, depois aguarda todas
for (int i = 0; i < 10; i++) { threads[i].start(); }
for (int i = 0; i < 10; i++) { threads[i].join(); }

// Programa B: inicia uma, aguarda ela terminar, inicia próxima
for (int i = 0; i < 10; i++) {
  threads[i].start();
  threads[i].join(); // join logo após start
}`,
    options: [
      "São equivalentes — start() e join() no mesmo loop têm o mesmo efeito",
      "Programa A executa as 10 threads em paralelo (concorrente); Programa B executa sequencialmente uma por vez",
      "Programa B é mais eficiente pois evita conflito entre threads",
      "Programa A falha porque join() não pode ser chamado depois que todas as threads foram iniciadas",
    ],
    correct: [1],
    explanation: "Programa A: inicia as 10 threads de uma vez (paralelo), depois aguarda todas terminarem. Com múltiplos processadores, o trabalho é dividido — mais eficiente. Programa B: inicia thread 0, bloqueia até ela terminar (join), aí inicia thread 1... totalmente sequencial. Desperdiça o potencial de paralelismo. O Programa A é mais eficiente em hardware multicore. join() faz a thread atual esperar a thread alvo concluir.",
  },
  {
    id: 58, type: "single", topic: "Threads",
    question: "Para que serve o modificador 'synchronized' em Java?",
    options: [
      "Para fazer um método executar mais rápido usando otimização do compilador",
      "Para garantir que apenas uma thread por vez execute o método, evitando condições de corrida em dados compartilhados",
      "Para iniciar uma thread automaticamente quando o objeto é criado",
      "Para forçar que o método seja executado em uma thread separada da main",
    ],
    correct: [1],
    explanation: "synchronized garante exclusão mútua: apenas uma thread por vez executa aquele método/bloco no mesmo objeto. Sem synchronized, duas threads podem ler/escrever o mesmo dado simultaneamente, causando condições de corrida (race conditions) e resultados imprevisíveis. Por que não usar em tudo? synchronized adiciona overhead (custo) e pode causar deadlock se usado incorretamente. Use apenas em métodos que acessam estado compartilhado entre threads.",
  },
  // ── ESCREVER/COMPLETAR CÓDIGO (code) ─────────────────────────────────────────
  {
    id: 59, type: "code", topic: "Classes e Objetos",
    question: "Complete a classe Carro com construtor e getter para o atributo marca:",
    starterCode: `public class Carro {
  private String _1_;

  public _2_(String marca) {
    _3_ = marca;
  }

  public String _4_() {
    return _5_;
  }
}`,
    slots: [
      { id: "_1_", label: "atributo", answer: "marca" },
      { id: "_2_", label: "construtor", answer: "Carro" },
      { id: "_3_", label: "this.?", answer: "this.marca" },
      { id: "_4_", label: "getter", answer: "getMarca" },
      { id: "_5_", label: "retorno", answer: "marca" },
    ],
    explanation: "Encapsulamento na prática: atributo 'private String marca' oculta o dado. Construtor 'Carro(String marca)' — mesmo nome da classe, sem tipo de retorno — inicializa com 'this.marca = marca' (distingue o parâmetro do atributo). Getter 'getMarca()' retorna o atributo. Convenção Java: getters têm prefixo 'get' + nome do atributo com inicial maiúscula.",
  },
  {
    id: 60, type: "code", topic: "Herança",
    question: "Complete a subclasse Cachorro que herda de Animal e sobrescreve emitirSom():",
    starterCode: `public class Animal {
  protected String nome;
  public void emitirSom() {
    System.out.println("...");
  }
}

public class Cachorro _1_ Animal {
  public Cachorro(String nome) {
    _2_.nome = nome;
  }

  _3_
  public void emitirSom() {
    System.out.println("Au au!");
  }
}`,
    slots: [
      { id: "_1_", label: "herança", answer: "extends" },
      { id: "_2_", label: "ref. pai", answer: "super" },
      { id: "_3_", label: "anotação", answer: "@Override" },
    ],
    explanation: "'extends Animal' declara a herança. Dentro do construtor, 'super.nome = nome' acessa o atributo 'protected' herdado (protected é acessível em subclasses). '@Override' antes do método indica sobrescrita — o compilador verifica se o método existe na superclasse, protegendo contra erros de digitação. Sem @Override o código funciona, mas a anotação é boa prática obrigatória.",
  },
  {
    id: 61, type: "code", topic: "Interfaces",
    question: "Declare a interface Pagavel e implemente-a na classe Boleto:",
    starterCode: `_1_ Pagavel {
  _2_ void pagar(double valor);
}

public class Boleto _3_ Pagavel {
  _4_
  public void pagar(double valor) {
    System.out.println("Boleto pago: R$" + valor);
  }
}`,
    slots: [
      { id: "_1_", label: "declarar", answer: "public interface" },
      { id: "_2_", label: "modificador", answer: "public" },
      { id: "_3_", label: "implementar", answer: "implements" },
      { id: "_4_", label: "anotação", answer: "@Override" },
    ],
    explanation: "'public interface Pagavel' declara a interface. Métodos de interface são implicitamente 'public abstract' — escrever 'public' é redundante mas válido. 'implements Pagavel' cumpre o contrato. '@Override' confirma que o método implementa o da interface. Se Boleto não implementar todos os métodos da interface e não for abstrata, o compilador gera erro.",
  },
  {
    id: 62, type: "code", topic: "Tratamento de Exceções",
    question: "Complete o bloco de tratamento de exceção para leitura de arquivo:",
    starterCode: `public void lerArquivo(String caminho) {
  _1_ {
    BufferedReader br = new BufferedReader(
      new FileReader(caminho)
    );
    String linha = br.readLine();
    System.out.println(linha);
    br.close();
  } _2_ (IOException e) {
    System.out.println("Erro: " + e.getMessage());
  } _3_ {
    System.out.println("Finalizado.");
  }
}`,
    slots: [
      { id: "_1_", label: "bloco", answer: "try" },
      { id: "_2_", label: "captura", answer: "catch" },
      { id: "_3_", label: "sempre", answer: "finally" },
    ],
    explanation: "Estrutura try-catch-finally: 'try' envolve o código que pode lançar exceção. 'catch(IOException e)' captura especificamente erros de I/O (leitura/escrita). 'finally' executa SEMPRE — ideal para mensagens de log ou garantir que recursos foram processados. Melhoria moderna: use try-with-resources ('try (BufferedReader br = ...)') que fecha automaticamente sem precisar de finally.",
  },
  {
    id: 63, type: "code", topic: "Classes Abstratas",
    question: "Complete a classe abstrata Forma e a subclasse Circulo:",
    starterCode: `_1_ class Forma {
  _2_ double calcularArea();

  public void exibir() {
    System.out.println("Area: " + calcularArea());
  }
}

public class Circulo _3_ Forma {
  private double raio;

  public Circulo(double raio) { this.raio = raio; }

  _4_
  public double calcularArea() {
    return Math.PI * raio * _5_;
  }
}`,
    slots: [
      { id: "_1_", label: "modificador", answer: "public abstract" },
      { id: "_2_", label: "método abstrato", answer: "public abstract" },
      { id: "_3_", label: "herança", answer: "extends" },
      { id: "_4_", label: "anotação", answer: "@Override" },
      { id: "_5_", label: "fórmula", answer: "raio" },
    ],
    explanation: "'public abstract class Forma' não pode ser instanciada. 'public abstract double calcularArea()' não tem corpo — é um contrato para as subclasses. 'Circulo extends Forma' herda e @Override implementa calcularArea(). A fórmula da área do círculo é Math.PI * raio * raio (π·r²). O método exibir() na superclasse chama calcularArea() — polimorfismo: executa a versão da subclasse real.",
  },

  // ── ADIVINHAR SAÍDA (output) ──────────────────────────────────────────────
  {
    id: 64, type: "single", topic: "Ache o Erro (Java)",
    question: "Qual é a saída deste programa?",
    code: `public class Teste {
  public static void main(String[] args) {
    int x = 10;
    int y = 3;
    System.out.println(x / y);
    System.out.println(x % y);
  }
}`,
    options: ["3.333... e 1", "3 e 1", "3.0 e 1.0", "Erro de compilação"],
    correct: [1],
    explanation: "x e y são int, então x/y é divisão inteira: 10/3 = 3 (descarta a parte decimal). x%y é o resto: 10 = 3×3 + 1, então o resto é 1. Para obter 3.333..., ao menos um operando deve ser double: (double)x/y ou 10.0/3. O operador % (módulo) é muito útil para verificar se um número é par (n%2==0), múltiplo, etc.",
  },
  {
    id: 65, type: "single", topic: "Ache o Erro (Java)",
    question: "O que este código imprime?",
    code: `public class Heranca {
  static class Animal {
    public String som() { return "..."; }
  }
  static class Gato extends Animal {
    public String som() { return "Miau"; }
  }
  public static void main(String[] args) {
    Animal a = new Gato();
    System.out.println(a.som());
  }
}`,
    options: ["...", "Miau", "Erro de compilação", "Erro em tempo de execução"],
    correct: [1],
    explanation: "Isso é polimorfismo em ação! A variável 'a' é do tipo Animal (referência), mas o objeto real é um Gato (instância). Em Java, a chamada de método é resolvida em TEMPO DE EXECUÇÃO pelo tipo real do objeto — não pelo tipo da referência. Portanto, a.som() chama o Gato.som() e imprime 'Miau'. Isso só funciona porque som() foi sobrescrito (@Override implícito aqui).",
  },
  {
    id: 66, type: "single", topic: "Ache o Erro (Java)",
    question: "Qual a saída deste trecho com exceção?",
    code: `try {
  System.out.println("A");
  int[] arr = new int[3];
  arr[5] = 10;
  System.out.println("B");
} catch (ArrayIndexOutOfBoundsException e) {
  System.out.println("C");
} finally {
  System.out.println("D");
}`,
    options: ["A, B, C, D", "A, C, D", "A, B, D", "A, D"],
    correct: [1],
    explanation: "'A' é impresso normalmente. arr[5] lança ArrayIndexOutOfBoundsException (array tem só índices 0,1,2). 'B' NUNCA é alcançado — a exceção interrompe o fluxo do try imediatamente. O catch captura a exceção e imprime 'C'. finally sempre executa e imprime 'D'. Saída: A → C → D. Memorize: depois de uma exceção no try, o restante do try é pulado.",
  },
  {
    id: 67, type: "single", topic: "Ache o Erro (Java)",
    question: "O que este código com static imprime?",
    code: `public class Contador {
  static int total = 0;
  int id;

  public Contador() {
    total++;
    id = total;
  }

  public static void main(String[] args) {
    Contador c1 = new Contador();
    Contador c2 = new Contador();
    Contador c3 = new Contador();
    System.out.println(c2.id + " " + Contador.total);
  }
}`,
    options: ["2 2", "2 3", "1 3", "Erro — id não pode ser acessado via objeto"],
    correct: [1],
    explanation: "'static int total' é compartilhado por TODOS os objetos da classe — existe uma única cópia na memória. Cada new Contador() incrementa total e atribui o valor atual ao 'id' daquele objeto. Após 3 instâncias: c1.id=1, c2.id=2, c3.id=3, total=3. c2.id=2, Contador.total=3 → imprime '2 3'. Atributos static pertencem à classe, não ao objeto — mas podem ser acessados via objeto (embora não seja boa prática).",
  },
  {
    id: 68, type: "single", topic: "Ache o Erro (Java)",
    question: "Qual a saída deste código com String?",
    code: `String a = "Java";
String b = "Java";
String c = new String("Java");

System.out.println(a == b);
System.out.println(a == c);
System.out.println(a.equals(c));`,
    options: [
      "true, true, true",
      "true, false, true",
      "false, false, true",
      "true, false, false",
    ],
    correct: [1],
    explanation: "'a == b' → true: literais String são internados (String Pool) — 'Java' já existe no pool, b aponta para o mesmo objeto. 'a == c' → false: new String() cria NOVO objeto no heap, fora do pool — referências diferentes, == compara referências. 'a.equals(c)' → true: equals() compara o CONTEÚDO da String. Regra de ouro: NUNCA compare Strings com ==, sempre use .equals().",
  },
  {
    id: 69, type: "code", topic: "Polimorfismo",
    question: "Complete o exemplo de polimorfismo com classe abstrata:",
    starterCode: `abstract class Forma {
  public _1_ double area();
}

class Quadrado _2_ Forma {
  double lado;
  Quadrado(double lado) { this.lado = lado; }

  _3_
  public double area() {
    return _4_ * _4_;
  }
}

class Main {
  public static void main(String[] args) {
    Forma f = new _5_(4.0);
    System.out.println(f.area()); // 16.0
  }
}`,
    slots: [
      { id: "_1_", label: "modificador", answer: "abstract" },
      { id: "_2_", label: "herança", answer: "extends" },
      { id: "_3_", label: "anotação", answer: "@Override" },
      { id: "_4_", label: "variável", answer: "lado" },
      { id: "_5_", label: "instância", answer: "Quadrado" },
    ],
    explanation: "'abstract double area()' define método sem corpo — cada subclasse implementa diferente (polimorfismo). 'extends Forma' herda. '@Override' confirma sobrescrita. 'lado * lado' calcula a área do quadrado. 'new Quadrado(4.0)' — a referência é do tipo Forma (abstrata), mas o objeto é Quadrado. f.area() executa o Quadrado.area() → 16.0. A variável de tipo abstrato permite tratar qualquer Forma uniformemente.",
  },
  {
    id: 70, type: "code", topic: "Coleções Java",
    question: "Complete o código que usa ArrayList e percorre com for-each:",
    starterCode: `import java.util._1_;

public class Exemplo {
  public static void main(String[] args) {
    _2_<String> nomes = new ArrayList<>();

    nomes._3_("Ana");
    nomes._3_("Bruno");
    nomes._3_("Carlos");

    for (_4_ nome : nomes) {
      System.out.println(nome);
    }
  }
}`,
    slots: [
      { id: "_1_", label: "import", answer: "ArrayList" },
      { id: "_2_", label: "tipo", answer: "ArrayList" },
      { id: "_3_", label: "método", answer: "add" },
      { id: "_4_", label: "tipo elem.", answer: "String" },
    ],
    explanation: "'import java.util.ArrayList' importa a classe. 'ArrayList<String>' — o <String> é o tipo genérico, garante que só Strings sejam adicionadas (type safety). 'add()' insere no final da lista. O for-each ('for (String nome : nomes)') percorre cada elemento sem precisar de índice — mais limpo que o for tradicional. ArrayList mantém a ordem de inserção: Ana, Bruno, Carlos.",
  },
  {
    id: 71, type: "code", topic: "Encapsulamento",
    question: "Complete a classe ContaBancaria com encapsulamento correto e validação no saque:",
    starterCode: `public class ContaBancaria {
  _1_ double saldo;
  _2_ String titular;

  public ContaBancaria(String titular, double saldoInicial) {
    _3_.titular = titular;
    _3_.saldo = saldoInicial;
  }

  public void sacar(double valor) {
    if (valor > _3_.saldo) {
      System.out.println("Saldo insuficiente!");
      return;
    }
    _3_.saldo _4_= valor;
  }

  public double _5_() {
    return saldo;
  }
}`,
    slots: [
      { id: "_1_", label: "modificador saldo", answer: "private" },
      { id: "_2_", label: "modificador titular", answer: "private" },
      { id: "_3_", label: "referência", answer: "this" },
      { id: "_4_", label: "operador", answer: "-" },
      { id: "_5_", label: "getter", answer: "getSaldo" },
    ],
    explanation: "Atributos 'private' impedem acesso direto de fora — ninguém faz conta.saldo = -999. 'this' distingue o atributo do parâmetro de mesmo nome. O getter 'getSaldo()' expõe o saldo somente para leitura. O saque valida antes de executar — lógica de negócio protegida dentro da classe. Isso é encapsulamento real: o objeto controla seu próprio estado.",
  },
  {
    id: 72, type: "code", topic: "Herança",
    question: "Complete a hierarquia Funcionario → Gerente com bônus no salário:",
    starterCode: `public class Funcionario {
  protected String nome;
  protected double salario;

  public Funcionario(String nome, double salario) {
    this.nome = nome;
    this.salario = salario;
  }

  public double calcularSalario() {
    return _1_;
  }
}

public class Gerente _2_ Funcionario {
  private double bonus;

  public Gerente(String nome, double salario, double bonus) {
    _3_(nome, salario);
    this.bonus = bonus;
  }

  _4_
  public double calcularSalario() {
    return _5_ + bonus;
  }
}`,
    slots: [
      { id: "_1_", label: "retorno base", answer: "salario" },
      { id: "_2_", label: "herança", answer: "extends" },
      { id: "_3_", label: "chama pai", answer: "super" },
      { id: "_4_", label: "anotação", answer: "@Override" },
      { id: "_5_", label: "salário base", answer: "super.calcularSalario()" },
    ],
    explanation: "'return salario' retorna o atributo herdado. 'extends Funcionario' estabelece herança. 'super(nome, salario)' chama o construtor do pai — obrigatório ser a primeira linha. '@Override' marca sobrescrita. 'super.calcularSalario()' chama o método do pai (retorna salario) e soma o bônus — reutiliza a lógica existente em vez de duplicar.",
  },
  {
    id: 73, type: "code", topic: "Tratamento de Exceções",
    question: "Complete a classe com exceção customizada e seu lançamento:",
    starterCode: `public class SaldoInsuficienteException _1_ Exception {
  public SaldoInsuficienteException(String msg) {
    _2_(msg);
  }
}

public class Conta {
  private double saldo = 1000.0;

  public void sacar(double valor) _3_ SaldoInsuficienteException {
    if (valor > saldo) {
      _4_ new SaldoInsuficienteException(
        "Saldo: " + saldo + " | Solicitado: " + valor
      );
    }
    saldo -= valor;
  }
}`,
    slots: [
      { id: "_1_", label: "herdar", answer: "extends" },
      { id: "_2_", label: "construtor pai", answer: "super" },
      { id: "_3_", label: "declarar", answer: "throws" },
      { id: "_4_", label: "lançar", answer: "throw" },
    ],
    explanation: "Exceção customizada: estende Exception (checked — obriga tratamento). super(msg) passa a mensagem ao construtor de Exception, acessível via e.getMessage(). 'throws' na assinatura declara que o método PODE lançar — quem chamar sacar() é obrigado a usar try-catch ou também declarar throws. 'throw new' cria e lança a instância — note: throw (lança) ≠ throws (declara).",
  },
  {
    id: 74, type: "code", topic: "Interfaces",
    question: "Complete o sistema de pagamento com interface e duas implementações:",
    starterCode: `public _1_ FormaPagamento {
  void _2_(double valor);
  String _3_();
}

public class CartaoCredito _4_ FormaPagamento {
  _5_
  public void pagar(double valor) {
    System.out.println("Cartão: R$" + valor);
  }
  _5_
  public String getDescricao() { return "Cartão de Crédito"; }
}

public class Pix _4_ FormaPagamento {
  _5_
  public void pagar(double valor) {
    System.out.println("Pix: R$" + valor);
  }
  _5_
  public String getDescricao() { return "Pix"; }
}`,
    slots: [
      { id: "_1_", label: "declarar", answer: "interface" },
      { id: "_2_", label: "método 1", answer: "pagar" },
      { id: "_3_", label: "método 2", answer: "getDescricao" },
      { id: "_4_", label: "implementar", answer: "implements" },
      { id: "_5_", label: "anotação", answer: "@Override" },
    ],
    explanation: "'interface' declara o contrato. Métodos na interface são implicitamente public abstract — sem corpo. 'implements' é obrigatório para cumprir o contrato. '@Override' em cada método implementado é boa prática. Agora você pode usar: FormaPagamento p = new Pix(); p.pagar(100); — polimorfismo via interface. Trocar de Pix para CartaoCredito não muda nada no código que usa FormaPagamento.",
  },
  {
    id: 75, type: "code", topic: "Banco de Dados & JDBC",
    question: "Complete o código JDBC para buscar usuários no banco:",
    starterCode: `public void buscarUsuarios() {
  _1_ con = null;
  try {
    con = DriverManager.getConnection(URL, USER, PASS);
    _2_ st = con.createStatement();
    _3_ rs = st.executeQuery("SELECT id, nome FROM usuarios");

    while (rs._4_()) {
      int id = rs.getInt("id");
      String nome = rs._5_("nome");
      System.out.println(id + " - " + nome);
    }
  } catch (SQLException e) {
    System.out.println("Erro: " + e.getMessage());
  } finally {
    if (con != null) try { con.close(); } catch (SQLException e) {}
  }
}`,
    slots: [
      { id: "_1_", label: "conexão", answer: "Connection" },
      { id: "_2_", label: "statement", answer: "Statement" },
      { id: "_3_", label: "resultado", answer: "ResultSet" },
      { id: "_4_", label: "iterar", answer: "next" },
      { id: "_5_", label: "ler String", answer: "getString" },
    ],
    explanation: "Hierarquia JDBC: Connection (ponte com o banco) → Statement (executa SQL) → ResultSet (cursor nos resultados). rs.next() avança uma linha e retorna false ao terminar — perfeito para o while. rs.getInt() e rs.getString() leem colunas pelo nome. Connection é fechada no finally — garantia de liberar recursos mesmo com exceção. Use PreparedStatement no lugar de Statement para evitar SQL Injection.",
  },
];

const TOPICS = ["Todos", ...new Set(QUESTIONS.map((q) => q.topic))];
const TYPE_LABELS = { single: "Múltipla Escolha", multi: "Múltiplas Certas", fill: "Completar Lacuna", debug: "Ache o Erro", code: "Escrever Código" };
const TYPE_COLORS = { single: C.purple, multi: C.blue, fill: C.yellow, debug: C.red, code: "#34d399" };

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Btn({ children, onClick, style, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none", borderRadius: 10, padding: "12px 20px",
        fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "opacity 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      letterSpacing: 1, padding: "3px 10px", borderRadius: 20,
      background: color + "22", color, border: `1px solid ${color}55`,
    }}>
      {children}
    </span>
  );
}

function ProgressBar({ value, max, color = C.purple }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, transition: "width 0.4s ease", borderRadius: 2 }} />
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#070912", border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "14px 16px", fontSize: 12.5, lineHeight: 1.7, overflowX: "auto",
      color: "#a9b8e0", fontFamily: "'Fira Code', 'Courier New', monospace",
      margin: "12px 0",
    }}>
      {code}
    </pre>
  );
}

// ─── QUESTÃO: MÚLTIPLA ESCOLHA (single / debug) ───────────────────────────────
function SingleQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const shuffledOpts = useMemo(() =>
    q.options.map((text, i) => ({ text, idx: i }))
      .sort(() => Math.random() - 0.5)
  , [q.id]);

  const confirm = () => {
    if (selected === null) return;
    setDone(true);
    const isCorrect = q.correct.includes(selected);
    setTimeout(() => onAnswer(isCorrect), 1200);
  };

  return (
    <div>
      {q.code && <CodeBlock code={q.code} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
        {shuffledOpts.map((opt) => {
          const isSelected = selected === opt.idx;
          const isRight = q.correct.includes(opt.idx);
          let bg = C.card, border = C.border, color = C.text;

          if (done) {
            if (isRight) { bg = C.greenDim; border = C.green; color = C.green; }
            else if (isSelected) { bg = C.redDim; border = C.red; color = C.red; }
          } else if (isSelected) {
            bg = C.purpleDim; border = C.purple; color = C.purple;
          }

          return (
            <button
              key={opt.idx}
              onClick={() => !done && setSelected(opt.idx)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "13px 16px", borderRadius: 10, border: `1px solid ${border}`,
                background: bg, color, cursor: done ? "default" : "pointer",
                textAlign: "left", transition: "all 0.15s", fontSize: 14, lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700, flexShrink: 0, fontSize: 13, marginTop: 1 }}>
                {done && isRight ? "✓" : done && isSelected ? "✗" : ["A","B","C","D","E"][shuffledOpts.indexOf(opt)]}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
      {!done && (
        <Btn onClick={confirm} disabled={selected === null}
          style={{ width: "100%", background: C.purple, color: "#fff" }}>
          Confirmar
        </Btn>
      )}
    </div>
  );
}

// ─── QUESTÃO: MÚLTIPLAS CORRETAS ─────────────────────────────────────────────
function MultiQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState([]);
  const [done, setDone] = useState(false);

  const shuffledOpts = useMemo(() =>
    q.options.map((text, i) => ({ text, idx: i })).sort(() => Math.random() - 0.5)
  , [q.id]);

  const toggle = (idx) => {
    if (done) return;
    setSelected((prev) => prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]);
  };

  const confirm = () => {
    if (selected.length === 0) return;
    setDone(true);
    const correct = [...q.correct].sort();
    const chosen = [...selected].sort();
    const isCorrect = JSON.stringify(correct) === JSON.stringify(chosen);
    setTimeout(() => onAnswer(isCorrect), 1200);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px", fontStyle: "italic" }}>
        Selecione TODAS as corretas
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {shuffledOpts.map((opt) => {
          const isSelected = selected.includes(opt.idx);
          const isRight = q.correct.includes(opt.idx);
          let bg = C.card, border = C.border, color = C.text;

          if (done) {
            if (isRight) { bg = C.greenDim; border = C.green; color = C.green; }
            else if (isSelected) { bg = C.redDim; border = C.red; color = C.red; }
          } else if (isSelected) {
            bg = C.purpleDim; border = C.purple; color = C.purple;
          }

          return (
            <button
              key={opt.idx}
              onClick={() => toggle(opt.idx)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "13px 16px", borderRadius: 10, border: `1px solid ${border}`,
                background: bg, color, cursor: done ? "default" : "pointer",
                textAlign: "left", transition: "all 0.15s", fontSize: 14, lineHeight: 1.5,
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? (isRight ? C.green : (isSelected ? C.red : C.dim)) : (isSelected ? C.purple : C.dim)}`,
                background: isSelected ? (done ? (isRight ? C.green : C.red) : C.purple) : "transparent",
                flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isSelected && <span style={{ fontSize: 10, color: "#fff", fontWeight: 900 }}>✓</span>}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
      {!done && (
        <Btn onClick={confirm} disabled={selected.length === 0}
          style={{ width: "100%", background: C.blue, color: "#fff" }}>
          Confirmar ({selected.length} selecionada{selected.length !== 1 ? "s" : ""})
        </Btn>
      )}
    </div>
  );
}

// ─── QUESTÃO: COMPLETAR LACUNA ────────────────────────────────────────────────
function FillQuestion({ q, onAnswer }) {
  const [slots, setSlots] = useState(Array(q.blanks.length).fill(null));
  const [available, setAvailable] = useState(shuffle([...q.options]));
  const [done, setDone] = useState(false);

  const placeInSlot = (word, slotIdx) => {
    if (done) return;
    const prev = slots[slotIdx];
    const newSlots = [...slots];
    newSlots[slotIdx] = word;
    if (prev !== null) setAvailable((a) => [...a, prev]);
    setAvailable((a) => a.filter((w) => w !== word));
    setSlots(newSlots);
  };

  const removeFromSlot = (slotIdx) => {
    if (done) return;
    const word = slots[slotIdx];
    if (!word) return;
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setAvailable((a) => [...a, word]);
  };

  const confirm = () => {
    if (slots.some((s) => s === null)) return;
    setDone(true);
    const isCorrect = slots.every((s, i) => s === q.blanks[i]);
    setTimeout(() => onAnswer(isCorrect), 1400);
  };

  // Parse question into parts
  const parts = q.question.split("_____");
  let slotCount = 0;

  return (
    <div>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: "16px", marginBottom: 16, lineHeight: 2.2, fontSize: 15,
      }}>
        {parts.map((part, i) => {
          const si = slotCount++;
          const isLast = i === parts.length - 1;
          const word = slots[si - 1];
          const correct = q.blanks[si - 1];
          let slotBg = C.surface, slotBorder = C.border, slotColor = C.muted;

          if (done && si > 0) {
            slotBg = word === correct ? C.greenDim : C.redDim;
            slotBorder = word === correct ? C.green : C.red;
            slotColor = word === correct ? C.green : C.red;
          } else if (si > 0 && word) {
            slotBg = C.purpleDim; slotBorder = C.purple; slotColor = C.purple;
          }

          return (
            <span key={i}>
              {i > 0 && (
                <button
                  onClick={() => !done && removeFromSlot(si - 1)}
                  style={{
                    display: "inline-block", minWidth: 100, padding: "2px 10px",
                    border: `1px dashed ${slotBorder}`, borderRadius: 6,
                    background: slotBg, color: slotColor, cursor: done ? "default" : "pointer",
                    fontWeight: 700, fontSize: 13, verticalAlign: "middle", margin: "0 4px",
                  }}
                >
                  {word || "___"}
                  {done && word !== correct && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>→{correct}</span>}
                </button>
              )}
              <span style={{ color: C.text }}>{part}</span>
            </span>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: C.muted, margin: "0 0 10px" }}>Palavras disponíveis — clique para colocar na próxima lacuna livre:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {available.map((word) => (
          <button
            key={word}
            onClick={() => {
              if (done) return;
              const nextEmpty = slots.findIndex((s) => s === null);
              if (nextEmpty !== -1) placeInSlot(word, nextEmpty);
            }}
            style={{
              padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: C.card, color: C.text, cursor: done ? "default" : "pointer",
              fontSize: 13, fontWeight: 600, transition: "all 0.1s",
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {!done && (
        <Btn onClick={confirm} disabled={slots.some((s) => s === null)}
          style={{ width: "100%", background: C.yellow, color: "#000" }}>
          Confirmar
        </Btn>
      )}
    </div>
  );
}


// ─── QUESTÃO: ESCREVER CÓDIGO ─────────────────────────────────────────────────
function CodeQuestion({ q, onAnswer }) {
  const [vals, setVals] = useState(() =>
    Object.fromEntries(q.slots.map((s) => [s.id, ""]))
  );
  const [done, setDone] = useState(false);
  const [results, setResults] = useState({});

  const confirm = () => {
    if (Object.values(vals).some((v) => v.trim() === "")) return;
    const r = {};
    q.slots.forEach((s) => {
      r[s.id] = vals[s.id].trim() === s.answer.trim();
    });
    setResults(r);
    setDone(true);
    const allCorrect = Object.values(r).every(Boolean);
    setTimeout(() => onAnswer(allCorrect), 1200);
  };

  // Render code with inputs inline
  const parts = q.starterCode.split(/(_[0-9]+_)/g);

  return (
    <div>
      <div style={{
        background: "#070912", border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "14px 16px", margin: "12px 0", fontFamily: "'Fira Code','Courier New',monospace",
        fontSize: 13, lineHeight: 2,
      }}>
        {parts.map((part, i) => {
          const slot = q.slots.find((s) => s.id === part);
          if (!slot) return <span key={i} style={{ color: "#a9b8e0" }}>{part}</span>;
          const isDone = done;
          const isRight = results[slot.id];
          return (
            <input
              key={i}
              value={vals[slot.id]}
              onChange={(e) => !done && setVals((prev) => ({ ...prev, [slot.id]: e.target.value }))}
              placeholder={slot.label}
              style={{
                display: "inline-block",
                width: Math.max(slot.answer.length * 9, 80) + "px",
                padding: "1px 6px", margin: "0 2px",
                borderRadius: 5, fontSize: 12, fontFamily: "inherit",
                border: `1px dashed ${isDone ? (isRight ? C.green : C.red) : C.purple}`,
                background: isDone ? (isRight ? C.greenDim : C.redDim) : C.purpleDim,
                color: isDone ? (isRight ? C.green : C.red) : C.purple,
                outline: "none", fontWeight: 700,
              }}
            />
          );
        })}
      </div>

      {done && (
        <div style={{ marginBottom: 12 }}>
          {q.slots.map((s) => !results[s.id] && (
            <div key={s.id} style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>
              <span style={{ color: C.red }}>✗ {s.label}:</span>
              {" "}esperado <span style={{ color: C.green, fontWeight: 700 }}>{s.answer}</span>
            </div>
          ))}
        </div>
      )}

      {!done && (
        <Btn
          onClick={confirm}
          disabled={Object.values(vals).some((v) => v.trim() === "")}
          style={{ width: "100%", background: "#0d2e22", border: `1px solid ${C.green}`, color: C.green }}
        >
          Verificar código
        </Btn>
      )}
    </div>
  );
}

// ─── PAINEL DE EXPLICAÇÃO ─────────────────────────────────────────────────────
function Explanation({ text, isCorrect }) {
  return (
    <div style={{
      background: isCorrect ? C.greenDim : C.redDim,
      border: `1px solid ${isCorrect ? C.green : C.red}`,
      borderRadius: 12, padding: "14px 16px", marginTop: 14,
    }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: isCorrect ? C.green : C.red }}>
        {isCorrect ? "✅ Correto!" : "❌ Errado!"}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.75, color: C.muted, margin: 0 }}>{text}</p>
    </div>
  );
}

// ─── ÁREA DE APRENDIZADO RÁPIDO ───────────────────────────────────────────────
const STUDY_CARDS = {
  "Pilares da POO": {
    icon: "🏛️",
    summary: "Os 4 pilares são a base de toda linguagem OO.",
    points: [
      "Abstração: modelar o mundo real ignorando detalhes desnecessários",
      "Encapsulamento: ocultar a implementação interna, expor só o necessário",
      "Herança: subclasse reutiliza e especializa a superclasse (extends)",
      "Polimorfismo: mesmo método, comportamentos diferentes conforme o tipo real",
    ],
    videos: [
      { title: "Aula 01 – Introdução à POO", url: "https://www.youtube.com/watch?v=KlIL63MeyMY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=1" },
      { title: "Aula 08 – Pilares da POO (Teoria)", url: "https://www.youtube.com/watch?v=Buw_y89ssNU&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=8" },
    ],
  },
  "Classes e Objetos": {
    icon: "📦",
    summary: "Classe = molde. Objeto = instância criada com 'new'.",
    points: [
      "Classe define estrutura: atributos (estado) + métodos (comportamento)",
      "Objeto é uma instância concreta em memória criada com 'new'",
      "Atributos de informação: cor, marca, modelo — definem o objeto",
      "Atributos de estado: velocidade atual, ligado — representam situações variáveis",
      "Métodos são as ações que o objeto pode realizar",
    ],
    videos: [
      { title: "Aula 03a – Classes e Objetos (Teoria)", url: "https://www.youtube.com/watch?v=SSu8Suf4Snk&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=3" },
      { title: "Aula 03b – Classes e Objetos (Prática)", url: "https://www.youtube.com/watch?v=NNRQ-3b-qEo&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=4" },
    ],
  },
  "Modificadores de Acesso": {
    icon: "🔒",
    summary: "Controlam quem pode acessar o quê.",
    points: [
      "private → só dentro da própria classe (mais restritivo)",
      "default (sem modificador) → mesmo pacote",
      "protected → mesma classe + subclasses + mesmo pacote",
      "public → qualquer lugar (menos restritivo)",
      "Boa prática: atributos private + getters/setters públicos",
    ],
    videos: [
      { title: "Aula 04a – Modificadores de Visibilidade (Teoria)", url: "https://www.youtube.com/watch?v=VFet7D4Ur4Y&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=5" },
    ],
  },
  "Construtores": {
    icon: "🔨",
    summary: "Inicializadores especiais chamados pelo 'new'.",
    points: [
      "Mesmo nome da classe, sem tipo de retorno (nem void!)",
      "Chamado automaticamente ao usar 'new'",
      "Sobrecarga de construtores: múltiplos com parâmetros diferentes",
      "Se não definir, Java cria um construtor padrão vazio implicitamente",
      "super() chama o construtor da superclasse — deve ser a 1ª linha",
    ],
    videos: [
      { title: "Aula 04a – Getters, Setters e Construtores (Teoria)", url: "https://www.youtube.com/watch?v=VFet7D4Ur4Y&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=5" },
      { title: "Aula 04b – Getters, Setters e Construtores (Prática)", url: "https://www.youtube.com/watch?v=o4bVAqx7KSo&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=6" },
    ],
  },
  "Herança": {
    icon: "🧬",
    summary: "Reutilize e especialize com 'extends'.",
    points: [
      "Java: herança simples — apenas 'extends UmaClasse'",
      "super() chama o construtor da superclasse (deve ser 1ª linha)",
      "@Override marca a sobrescrita de método herdado",
      "Atributos private do pai NÃO são acessíveis diretamente no filho",
      "Herança de implementação vs herança para diferença",
    ],
    videos: [
      { title: "Aula 11a – Herança (Teoria)", url: "https://www.youtube.com/watch?v=MemZOGOrjag&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=15" },
      { title: "Aula 11b – Herança (Prática)", url: "https://www.youtube.com/watch?v=MemZOGOrjag&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=16" },
      { title: "Aula 12a – Tipos de Herança (Teoria)", url: "https://www.youtube.com/watch?v=s3PIGJuRBCU&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=17" },
    ],
  },
  "Sobrescrita vs Sobrecarga": {
    icon: "⚡",
    summary: "Override (herança) ≠ Overloading (mesma classe).",
    points: [
      "Sobrescrita (Override): subclasse reimplementa método do pai — mesmos parâmetros",
      "Sobrecarga (Overloading): mesma classe, mesmo nome, parâmetros DIFERENTES",
      "@Override ajuda o compilador a detectar erros de sobrescrita",
      "Sobrecarga é resolvida em compilação; Sobrescrita em tempo de execução",
    ],
    videos: [
      { title: "Aula 13a – Polimorfismo de Sobrecarga (Teoria)", url: "https://www.youtube.com/watch?v=Y0JfODRMqXc&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=19" },
      { title: "Aula 13b – Polimorfismo de Sobrecarga (Prática)", url: "https://www.youtube.com/watch?v=Y0JfODRMqXc&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=20" },
    ],
  },
  "Interfaces": {
    icon: "📋",
    summary: "Contratos: define O QUÊ, não o COMO.",
    points: [
      "Declara métodos sem implementação (contrato)",
      "'implements' é usado para implementar uma interface",
      "Uma classe pode implementar MÚLTIPLAS interfaces",
      "Atributos são implicitamente public static final (constantes)",
      "Java 8+: métodos 'default' permitem implementação na interface",
    ],
    videos: [
      { title: "Aula 14a – Interfaces (Teoria)", url: "https://www.youtube.com/watch?v=GIokS91rLwY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=21" },
      { title: "Aula 14b – Interfaces (Prática)", url: "https://www.youtube.com/watch?v=GIokS91rLwY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=22" },
    ],
  },
  "Classes Abstratas": {
    icon: "🏗️",
    summary: "Base que não pode ser instanciada diretamente.",
    points: [
      "Declarada com 'abstract class' — não pode ser instanciada com 'new'",
      "Pode misturar métodos abstratos (sem corpo) e concretos (com corpo)",
      "Subclasses concretas DEVEM implementar todos os métodos abstratos",
      "Construtores abstratos não existem — construtores não são herdados",
      "Diferença vs Interface: pode ter estado (atributos de instância) e implementação",
    ],
    videos: [
      { title: "Aula 10a – Classes Abstratas (Teoria)", url: "https://www.youtube.com/watch?v=kgjHRs-Gyos&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=13" },
      { title: "Aula 10b – Classes Abstratas (Prática)", url: "https://www.youtube.com/watch?v=kgjHRs-Gyos&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=14" },
    ],
  },
  "Relacionamento entre Classes": {
    icon: "🔗",
    summary: "Composição (◆) vs Agregação (◇) vs Herança.",
    points: [
      "Composição (◆ preto): filho não existe sem o pai — ex: Banco ◆ Conta",
      "Agregação (◇ branco): filho existe independentemente — ex: Pessoa ◇ Endereço",
      "Multiplicidade: 1 = exatamente um; 1..* = um ou mais; 0..* = zero ou mais",
      "Associação simples: uma classe usa outra como atributo",
    ],
    videos: [
      { title: "Aula 09a – Relacionamento entre Classes – Agregação (Teoria)", url: "https://www.youtube.com/watch?v=NKoJWrMR3hA&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=11" },
      { title: "Aula 09b – Relacionamento entre Classes – Agregação (Prática)", url: "https://www.youtube.com/watch?v=NKoJWrMR3hA&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=12" },
    ],
  },
  "Java & JVM": {
    icon: "☕",
    summary: "Escreva uma vez, execute em qualquer lugar.",
    points: [
      "Fluxo: .java → javac → .class (bytecode) → JVM executa",
      "JVM torna Java multiplataforma (Windows, Linux, Mac)",
      "JDK = kit completo de desenvolvimento (inclui javac + JVM)",
      "IDEs: Eclipse, IntelliJ IDEA, Visual Studio Code",
      "Criado pela Sun Microsystems (1991); Oracle adquiriu em 2010",
    ],
    videos: [
      { title: "Aula 01 – Introdução e História do Java", url: "https://www.youtube.com/watch?v=KlIL63MeyMY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=1" },
      { title: "Aula 02 – Como Funciona o Java (JVM, bytecode)", url: "https://www.youtube.com/watch?v=sTX0UEplF54&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=2" },
    ],
  },
  "Tratamento de Exceções": {
    icon: "🛡️",
    summary: "try / catch / finally — trate erros com elegância.",
    points: [
      "try: código que pode gerar exceção",
      "catch(TipoException e): captura e trata — ordem do mais específico ao mais genérico!",
      "finally: SEMPRE executa — use para fechar recursos",
      "throw new Exception(): lança exceção manualmente (passa um OBJETO, não a classe)",
      "throws na assinatura: declara que o método pode lançar exceção (checked)",
      "RuntimeException = unchecked — compilador não obriga try-catch",
    ],
    videos: [
      { title: "Aula 15a – Tratamento de Erros e Exceções (Teoria)", url: "https://www.youtube.com/watch?v=ld2C4GcAtsg&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=23" },
      { title: "Aula 15b – Tratamento de Exceções (Prática)", url: "https://www.youtube.com/watch?v=ld2C4GcAtsg&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=24" },
    ],
  },
  "Banco de Dados & JDBC": {
    icon: "🗄️",
    summary: "JDBC conecta Java a bancos relacionais.",
    points: [
      "Connection → Statement/PreparedStatement → ResultSet (hierarquia JDBC)",
      "PreparedStatement previne SQL Injection (use ? para parâmetros)",
      "ResultSet: rs.next() itera linha a linha; rs.getString('col') lê valores",
      "Sempre feche Connection em finally ou use try-with-resources",
      "Driver JDBC específico de cada banco (MySQL, PostgreSQL...)",
    ],
    videos: [
      { title: "Aula 16a – Acesso a Banco de Dados com JDBC (Teoria)", url: "https://www.youtube.com/watch?v=52UrVDVoNJU&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=25" },
    ],
  },
  "Manipulação de Arquivos": {
    icon: "📁",
    summary: "Leia e escreva arquivos com FileReader/Writer + Buffer.",
    points: [
      "FileReader + BufferedReader: leitura de texto com readLine()",
      "FileWriter + BufferedWriter: escrita de texto com write() e newLine()",
      "BufferedReader/Writer adicionam buffer — menos operações de I/O no disco",
      "readLine() retorna null ao atingir o fim do arquivo — use como condição de loop",
      "Sempre feche os streams em finally ou use try-with-resources",
    ],
    videos: [
      { title: "Aula 17a – Arquivos: Leitura e Escrita (Teoria)", url: "https://www.youtube.com/watch?v=Kjza8mMZfBU&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=27" },
    ],
  },
  "Coesão e Acoplamento": {
    icon: "🧩",
    summary: "Alta coesão + acoplamento fraco = design saudável.",
    points: [
      "Coesão: responsabilidades de uma classe são relacionadas — alta coesão = uma classe faz uma coisa bem",
      "Acoplamento: grau de dependência entre classes — fraco = classes independentes",
      "Meta: ALTA coesão + acoplamento FRACO (caiu na prova UNICAP 2007!)",
      "Acoplamento fraco: entenda/modifique uma classe sem ler outras",
      "Acoplamento forte: mudança em A quebra B, C, D... efeito cascata",
      "Interfaces e injeção de dependência reduzem acoplamento",
    ],
    videos: [
      { title: "Aula 08 – Pilares da POO (inclui coesão e acoplamento)", url: "https://www.youtube.com/watch?v=Buw_y89ssNU&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=8" },
    ],
  },
  "Ache o Erro (Java)": {
    icon: "🐛",
    summary: "Bugs clássicos em Java que caem em prova.",
    points: [
      "1/2 em Java = 0 (divisão inteira!) — use 1.0/2 ou 0.5 para obter 0.5",
      "Construtor com 'void' vira método comum — construtor não tem tipo de retorno",
      "catch mais genérico (Exception) antes do específico = bloco inacessível → erro de compilação",
      "do-while imprime antes de verificar — use while quando não quer processar o sentinela",
      "Atributos public violam encapsulamento — qualquer código modifica sem validação",
      "Interface com método com corpo (sem 'default') = erro em Java < 8",
      "extends de múltiplas classes = erro — Java só permite herança simples",
      "new ClasseAbstrata() = erro de compilação — abstratas não instanciam",
    ],
    videos: [
      { title: "Aula 03a – Classes e Objetos (boas práticas)", url: "https://www.youtube.com/watch?v=SSu8Suf4Snk&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=3" },
      { title: "Aula 15a – Exceções (ordem dos catch)", url: "https://www.youtube.com/watch?v=ld2C4GcAtsg&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=23" },
    ],
  },
  "Coleções Java": {
    icon: "📚",
    summary: "List, Set e Map — escolha a certa para cada situação.",
    points: [
      "List: sequência ordenada, permite duplicatas — ArrayList = acesso O(1) por índice",
      "Set: sem duplicatas — HashSet (sem ordem), TreeSet (ordenado), LinkedHashSet (inserção)",
      "Map: pares chave→valor, chaves únicas — HashMap (sem ordem), TreeMap (ordenado)",
      "ArrayList vs array: ArrayList cresce dinamicamente, tem métodos prontos; array tem tamanho fixo",
      "Map.get(chave) retorna null se chave não existir — sempre verifique!",
      "Collections.sort() ordena List; também tem shuffle, reverse, max, min",
    ],
    videos: [
      { title: "Aula 18a – Coleções: List, Set e Map (Teoria)", url: "https://www.youtube.com/watch?v=MkqMGEDGcQ0&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=29" },
      { title: "Aula 18b – Coleções (Prática)", url: "https://www.youtube.com/watch?v=MkqMGEDGcQ0&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=30" },
    ],
  },
  "Threads": {
    icon: "⚙️",
    summary: "Execução paralela — cuidado com dados compartilhados.",
    points: [
      "Thread: unidade de execução paralela. Crie com 'new Thread(runnable).start()'",
      "start() inicia a thread; join() bloqueia a atual até a outra terminar",
      "start() todas → join() todas = PARALELO (eficiente em multicore)",
      "start() + join() no mesmo loop = SEQUENCIAL (anula o paralelismo)",
      "synchronized: garante que apenas 1 thread execute o método por vez",
      "Race condition: duas threads no mesmo dado sem sync = resultado imprevisível",
      "Não use synchronized em tudo: overhead + risco de deadlock",
    ],
    videos: [
      { title: "Aula 19a – Threads (Teoria)", url: "https://www.youtube.com/watch?v=lKh69NIW8AY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=31" },
      { title: "Aula 19b – Threads (Prática)", url: "https://www.youtube.com/watch?v=lKh69NIW8AY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=32" },
    ],
  },
  "Padrão de Projeto": {
    icon: "🏛️",
    summary: "Soluções reutilizáveis para problemas comuns de design.",
    points: [
      "Composite: trata objetos simples e composições uniformemente (atômico/composto)",
      "Facade (Fachada): interface simplificada para subsistema complexo",
      "Singleton: garante única instância de uma classe",
      "Strategy: família de algoritmos intercambiáveis (ex: formas de pagamento)",
      "Observer: notifica dependentes sobre mudanças (base dos listeners Swing)",
      "Arquitetura em camadas: Aplicação → Fachada → Controlador → Repositório",
    ],
    videos: [
      { title: "Aula 14a – Interfaces (base para padrões)", url: "https://www.youtube.com/watch?v=GIokS91rLwY&list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY&index=21" },
    ],
  },
};

// ─── TELA: ESTUDO RÁPIDO ──────────────────────────────────────────────────────
function StudyScreen({ recommended, onBack }) {
  const [openTopic, setOpenTopic] = useState(null);
  const topics = recommended.length > 0
    ? [...new Set(recommended)]
    : Object.keys(STUDY_CARDS);

  return (
    <div style={S.root}>
      <div style={S.container}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button onClick={onBack} style={S.backBtn}>←</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>Estudo Rápido</h2>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
              {recommended.length > 0 ? "⚠️ Você errou esses — clique para revisar" : "Todos os tópicos"}
            </p>
          </div>
        </div>

        {/* Playlist link */}
        <a
          href="https://www.youtube.com/playlist?list=PLHz_AreHm4dkqe2aR0tQK74m8SFe-aGsY"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#1a0a0a", border: "1px solid #7f1d1d",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 20 }}>▶️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>
              Playlist completa — Curso em Vídeo (Guanabara)
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>32 aulas · POO com Java · YouTube</div>
          </div>
          <span style={{ color: "#f87171", fontSize: 12 }}>↗</span>
        </a>

        {topics.map((topic) => {
          const card = STUDY_CARDS[topic];
          if (!card) return null;
          const isOpen = openTopic === topic;
          const isRecommended = recommended.includes(topic);
          return (
            <div
              key={topic}
              style={{
                ...S.card, marginBottom: 10, cursor: "pointer",
                borderColor: isRecommended ? C.red + "88" : C.border,
              }}
              onClick={() => setOpenTopic(isOpen ? null : topic)}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{card.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{topic}</span>
                    {isRecommended && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, background: C.redDim,
                        color: C.red, padding: "2px 7px", borderRadius: 10,
                      }}>revisar</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{card.summary}</div>
                </div>
                <span style={{ color: C.dim, fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div
                  style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Points */}
                  <div style={{ marginBottom: 16 }}>
                    {card.points.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
                        <span style={{ color: C.purple, fontWeight: 900, flexShrink: 0, fontSize: 12, marginTop: 2 }}>▸</span>
                        <span style={{ fontSize: 13, lineHeight: 1.65, color: C.muted }}>{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Videos */}
                  {card.videos && card.videos.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                        color: C.dim, textTransform: "uppercase", marginBottom: 8,
                      }}>
                        📺 Vídeos recomendados
                      </div>
                      {card.videos.map((v, i) => (
                        <a
                          key={i}
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: "#0d0f1a", border: "1px solid #1c2040",
                            borderRadius: 8, padding: "9px 12px", marginBottom: 6,
                            textDecoration: "none",
                          }}
                        >
                          <span style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: "#7f1d1d", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 12, flexShrink: 0,
                          }}>▶</span>
                          <span style={{ fontSize: 12, color: C.text, lineHeight: 1.4, flex: 1 }}>{v.title}</span>
                          <span style={{ color: C.dim, fontSize: 11, flexShrink: 0 }}>↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TELA: MENU ───────────────────────────────────────────────────────────────
// ─── STORAGE (ranking) ────────────────────────────────────────────────────────
function getRanking() {
  try {
    const data = localStorage.getItem("poo-ranking");
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}
function saveRanking(entries) {
  try { localStorage.setItem("poo-ranking", JSON.stringify(entries)); } catch {}
}

// ─── TELA: RANKING ────────────────────────────────────────────────────────────
function RankingScreen({ onBack }) {
  const [entries, setEntries] = useState(null);

  useState(() => {
    setEntries(getRanking());
  });

  // useEffect to load
  const [loaded, setLoaded] = useState(false);
  if (!loaded) { setEntries(getRanking()); setLoaded(true); }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={S.root}>
      <div style={S.container}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={S.backBtn}>←</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>🏆 Ranking</h2>
            <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Top jogadores — 63 questões</p>
          </div>
        </div>

        {!loaded ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Carregando...</div>
        ) : entries.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <p>Ninguém no ranking ainda.</p>
            <p style={{ fontSize: 13 }}>Complete o quiz com todas as questões para aparecer aqui!</p>
          </div>
        ) : (
          <div>
            {/* Top 3 podium */}
            {entries.slice(0, 3).length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "flex-end" }}>
                {[entries[1], entries[0], entries[2]].map((e, i) => {
                  if (!e) return <div key={i} style={{ flex: 1 }} />;
                  const heights = ["80px", "100px", "65px"];
                  const podiumPos = [2, 1, 3];
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 700 }}>
                        {e.name.length > 10 ? e.name.slice(0, 10) + "…" : e.name}
                      </div>
                      <div style={{ fontSize: 13, color: C.purple, fontWeight: 800, marginBottom: 4 }}>
                        {e.pct}%
                      </div>
                      <div style={{
                        height: heights[i], borderRadius: "8px 8px 0 0",
                        background: i === 1 ? "linear-gradient(180deg,#fbbf24,#d97706)" :
                          i === 0 ? "linear-gradient(180deg,#94a3b8,#64748b)" :
                          "linear-gradient(180deg,#b45309,#92400e)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24,
                      }}>
                        {medals[podiumPos[i] - 1]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div style={S.card}>
              <p style={S.label}>Classificação completa</p>
              {entries.map((e, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: i < entries.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: i < 3 ? ["#d97706","#94a3b8","#b45309"][i] + "33" : C.surface,
                    border: `1px solid ${i < 3 ? ["#fbbf24","#94a3b8","#b45309"][i] : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: i < 3 ? 14 : 12, fontWeight: 800,
                    color: i < 3 ? ["#fbbf24","#e2e8f0","#cd7c2f"][i] : C.dim,
                  }}>
                    {i < 3 ? medals[i] : i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{e.correct}/{e.total} corretas · {e.date}</div>
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 900,
                    color: e.pct >= 70 ? C.green : e.pct >= 50 ? C.yellow : C.red,
                  }}>{e.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL: NOME DO JOGADOR ───────────────────────────────────────────────────
function NameModal({ onConfirm }) {
  const [name, setName] = useState("");
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20,
    }}>
      <div style={{ ...S.card, width: "100%", maxWidth: 360, marginBottom: 0 }}>
        <h3 style={{ margin: "0 0 8px", color: C.text }}>🏆 Entrar no ranking!</h3>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>
          Digite seu nome para salvar no ranking compartilhado da turma.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
          placeholder="Seu nome ou apelido..."
          maxLength={20}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, marginBottom: 12,
            border: `1px solid ${C.purple}`, background: C.bg, color: C.text,
            fontSize: 14, outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => onConfirm(null)} style={{ flex: 1, background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>
            Pular
          </Btn>
          <Btn onClick={() => name.trim() && onConfirm(name.trim())} disabled={!name.trim()}
            style={{ flex: 1, background: C.purple, color: "#fff" }}>
            Salvar
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── TELA: MENU ───────────────────────────────────────────────────────────────
function MenuScreen({ onStart, onStudy, onRanking }) {
  const [topic, setTopic] = useState("Todos");
  const [types, setTypes] = useState(["single", "multi", "fill", "debug", "code"]);
  const [qty, setQty] = useState(0); // 0 = todas

  const toggleType = (t) =>
    setTypes((prev) => prev.includes(t) ? (prev.length > 1 ? prev.filter((x) => x !== t) : prev) : [...prev, t]);

  const pool = QUESTIONS.filter((q) =>
    (topic === "Todos" || q.topic === topic) && types.includes(q.type)
  );
  const count = pool.length;
  const qtyOptions = [0, 5, 10, 15, 20, 30].filter((n) => n === 0 || n <= count);

  return (
    <div style={S.root}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={S.badge}>SENAI · CDI · POO</div>
          <h1 style={{ ...S.gradientText, fontSize: 34, margin: "10px 0 6px" }}>Quiz POO</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            {QUESTIONS.length} questões · 5 tipos de exercício
          </p>
        </div>

        <div style={S.card}>
          <p style={S.label}>Tipo de questão</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <button key={k} onClick={() => toggleType(k)} style={{
                padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                border: `1px solid ${types.includes(k) ? TYPE_COLORS[k] : C.border}`,
                background: types.includes(k) ? TYPE_COLORS[k] + "22" : C.surface,
                color: types.includes(k) ? TYPE_COLORS[k] : C.muted,
              }}>
                {v}
              </button>
            ))}
          </div>

          <p style={S.label}>Filtrar por tema</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {TOPICS.map((t) => (
              <button key={t} onClick={() => setTopic(t)} style={{
                padding: "5px 11px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
                border: `1px solid ${topic === t ? C.purple : C.border}`,
                background: topic === t ? C.purpleDim : C.surface,
                color: topic === t ? C.purple : C.muted,
              }}>{t}</button>
            ))}
          </div>

          <p style={S.label}>Quantidade de questões</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {qtyOptions.map((n) => (
              <button key={n} onClick={() => setQty(n)} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: "pointer",
                border: `1px solid ${qty === n ? C.blue : C.border}`,
                background: qty === n ? C.blue + "22" : C.surface,
                color: qty === n ? C.blue : C.muted,
              }}>
                {n === 0 ? `Todas (${count})` : n}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.purple }}>
                {qty === 0 ? count : Math.min(qty, count)}
              </div>
              <div style={{ fontSize: 11, color: C.dim }}>questões</div>
            </div>
            <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.blue }}>{TOPICS.length - 1}</div>
              <div style={{ fontSize: 11, color: C.dim }}>tópicos</div>
            </div>
          </div>
        </div>

        <Btn onClick={() => onStart(topic, types, qty)} disabled={count === 0}
          style={{ width: "100%", background: "linear-gradient(135deg, #5b4fff, #9b60ff)", color: "#fff", fontSize: 16, padding: "15px", marginBottom: 8 }}>
          Começar Quiz →
        </Btn>
        <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
          <Btn onClick={() => onStudy([])}
            style={{ flex: 1, background: C.card, color: C.muted, border: `1px solid ${C.border}`, fontSize: 13 }}>
            📚 Estudar
          </Btn>
          <Btn onClick={onRanking}
            style={{ flex: 1, background: C.card, color: C.yellow, border: `1px solid ${C.yellow}44`, fontSize: 13 }}>
            🏆 Ranking
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── TELA: QUIZ ───────────────────────────────────────────────────────────────
function QuizScreen({ questions, onFinish, onBack }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showExp, setShowExp] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [wrongTopics, setWrongTopics] = useState([]);
  // Use ref to always have up-to-date score for onFinish
  const scoreRef = useRef({ correct: 0, wrong: 0 });
  const wrongRef = useRef([]);

  const q = questions[idx];

  const handleAnswer = (isCorrect) => {
    setLastCorrect(isCorrect);
    setShowExp(true);
    const next = {
      correct: scoreRef.current.correct + (isCorrect ? 1 : 0),
      wrong: scoreRef.current.wrong + (!isCorrect ? 1 : 0),
    };
    scoreRef.current = next;
    setScore(next);
    if (!isCorrect) {
      wrongRef.current = [...wrongRef.current, q.topic];
      setWrongTopics(wrongRef.current);
    }
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      onFinish(scoreRef.current, wrongRef.current);
    } else {
      setIdx((i) => i + 1);
      setShowExp(false);
      setLastCorrect(null);
    }
  };

  return (
    <div style={S.root}>
      <div style={S.container}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={onBack} style={S.backBtn}>←</button>
          <div style={{ flex: 1 }}>
            <ProgressBar value={idx} max={questions.length} />
            <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{idx + 1}/{questions.length}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: C.green }}>✓{score.correct}</span>
            {" "}
            <span style={{ color: C.red }}>✗{score.wrong}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <Tag color={TYPE_COLORS[q.type]}>{TYPE_LABELS[q.type]}</Tag>
          <Tag color={C.blue}>{q.topic}</Tag>
        </div>

        <div style={{ ...S.card, marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: C.text, fontWeight: 500 }}>
            {q.question}
          </p>
        </div>

        {q.type === "single" && <SingleQuestion key={q.id} q={q} onAnswer={handleAnswer} />}
        {q.type === "debug" && <SingleQuestion key={q.id} q={q} onAnswer={handleAnswer} />}
        {q.type === "multi" && <MultiQuestion key={q.id} q={q} onAnswer={handleAnswer} />}
        {q.type === "fill" && <FillQuestion key={q.id} q={q} onAnswer={handleAnswer} />}
        {q.type === "code" && <CodeQuestion key={q.id} q={q} onAnswer={handleAnswer} />}

        {showExp && <Explanation text={q.explanation} isCorrect={lastCorrect} />}

        {showExp && (
          <Btn onClick={next}
            style={{ width: "100%", marginTop: 14, background: C.surface, border: `1px solid ${C.purple}`, color: C.purple }}>
            {idx + 1 >= questions.length ? "Ver resultado →" : "Próxima →"}
          </Btn>
        )}
      </div>
    </div>
  );
}

// ─── TELA: RESULTADO ──────────────────────────────────────────────────────────
function SummaryScreen({ score, total, wrongTopics, onRestart, onMenu, onStudy, onRanking }) {
  const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
  const color = pct >= 70 ? C.green : pct >= 50 ? C.yellow : C.red;
  const uniqueWrong = [...new Set(wrongTopics)];
  const [showModal, setShowModal] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleName = (name) => {
    setShowModal(false);
    if (!name) return;
    const existing = getRanking();
    const entry = {
      name,
      correct: score.correct,
      total,
      pct,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [...existing, entry]
      .sort((a, b) => b.pct - a.pct || b.correct - a.correct)
      .slice(0, 20);
    saveRanking(updated);
    setSaved(true);
  };

  return (
    <div style={S.root}>
      {showModal && <NameModal onConfirm={handleName} />}
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 900, color, lineHeight: 1 }}>{pct}%</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "8px 0 4px" }}>
            {pct >= 70 ? "🎉 Mandou bem!" : pct >= 50 ? "📚 Quase lá!" : "💪 Continue praticando!"}
          </p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            {score.correct} de {total} corretas
          </p>
          {saved && <p style={{ fontSize: 12, color: C.green, marginTop: 6 }}>✓ Salvo no ranking!</p>}
        </div>

        <div style={S.card}>
          <ProgressBar value={score.correct} max={total} color={color} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ color: C.green, fontWeight: 700 }}>✓ {score.correct} corretas</span>
            <span style={{ color: C.red, fontWeight: 700 }}>✗ {score.wrong} erradas</span>
          </div>
        </div>

        {uniqueWrong.length > 0 && (
          <div style={S.card}>
            <p style={S.label}>📌 Tópicos para revisar</p>
            {uniqueWrong.map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>{STUDY_CARDS[t]?.icon || "📖"}</span>
                <span style={{ flex: 1, fontSize: 13, color: C.muted }}>{t}</span>
                <span style={{ color: C.red, fontWeight: 700, fontSize: 12 }}>
                  {wrongTopics.filter((x) => x === t).length}✗
                </span>
              </div>
            ))}
            <Btn onClick={() => onStudy(uniqueWrong)}
              style={{ width: "100%", marginTop: 12, background: C.yellowDim, border: `1px solid ${C.yellow}`, color: C.yellow }}>
              📚 Estudar esses tópicos
            </Btn>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <Btn onClick={onMenu} style={{ flex: 1, background: C.card, color: C.muted, border: `1px solid ${C.border}` }}>
            ← Menu
          </Btn>
          <Btn onClick={onRestart} style={{ flex: 1, background: "linear-gradient(135deg, #5b4fff, #9b60ff)", color: "#fff" }}>
            Refazer
          </Btn>
        </div>
        <Btn onClick={onRanking} style={{ width: "100%", background: C.yellowDim, border: `1px solid ${C.yellow}44`, color: C.yellow }}>
          🏆 Ver Ranking
        </Btn>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("menu");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [lastScore, setLastScore] = useState(null);
  const [lastWrongTopics, setLastWrongTopics] = useState([]);
  const [quizConfig, setQuizConfig] = useState({ topic: "Todos", types: [], qty: 0 });
  const [studyTopics, setStudyTopics] = useState([]);
  const startQuiz = (topic, types, qty) => {
    const pool = QUESTIONS.filter((q) =>
      (topic === "Todos" || q.topic === topic) && types.includes(q.type)
    );
    const shuffled = shuffle(pool);
    const final = qty > 0 ? shuffled.slice(0, qty) : shuffled;
    setQuizQuestions(final);
    setQuizConfig({ topic, types, qty });
    setScreen("quiz");
  };

  const finishQuiz = (score, wrongTopics) => {
    setLastScore({ ...score });
    setLastWrongTopics(wrongTopics);
    setScreen("summary");
  };

  if (screen === "menu") return <MenuScreen onStart={startQuiz} onStudy={(t) => { setStudyTopics(t); setScreen("study"); }} onRanking={() => setScreen("ranking")} />;
  if (screen === "quiz") return <QuizScreen questions={quizQuestions} onFinish={finishQuiz} onBack={() => setScreen("menu")} />;
  if (screen === "summary") return (
    <SummaryScreen
      score={lastScore}
      total={quizQuestions.length}
      wrongTopics={lastWrongTopics}
      onRestart={() => startQuiz(quizConfig.topic, quizConfig.types, quizConfig.qty)}
      onMenu={() => setScreen("menu")}
      onStudy={(t) => { setStudyTopics(t); setScreen("study"); }}
      onRanking={() => setScreen("ranking")}
    />
  );
  if (screen === "study") return <StudyScreen recommended={studyTopics} onBack={() => setScreen(lastScore ? "summary" : "menu")} />;
  if (screen === "ranking") return <RankingScreen onBack={() => setScreen(lastScore ? "summary" : "menu")} />;
  return null;
}

// ─── ESTILOS GLOBAIS ──────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 40,
  },
  container: { maxWidth: 640, margin: "0 auto", padding: "24px 16px" },
  card: {
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: 20, marginBottom: 14,
  },
  label: {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.dim,
    textTransform: "uppercase", margin: "0 0 12px",
  },
  badge: {
    display: "inline-block", background: C.card, color: C.purple,
    fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: "4px 12px",
    borderRadius: 20, textTransform: "uppercase",
  },
  gradientText: {
    background: "linear-gradient(135deg, #7c6fff, #c084fc)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontWeight: 900, margin: 0,
  },
  backBtn: {
    background: C.card, border: `1px solid ${C.border}`, color: C.muted,
    borderRadius: 8, padding: "6px 14px", fontSize: 16, cursor: "pointer", flexShrink: 0,
  },
};

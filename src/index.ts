/** Explicações:
 *
 * Imaginando que um sistema só tivesse opção de pagamento por boleto, e então é
 * necessário adicionar novos métodos, até o momento tudo relacionado a pagamento
 * estava dentro de uma classe chamada "MetodoPagamento", não tinha motivo para
 * criar várias classes e subclasses se só habia 1 método disponível, mas continuar
 * dessa forma acarretaria em um código mais complexo e cheio de ifs, onde a cada
 * novo método, novas condições teriam de ser criadas em uma única classe, nos
 * mesmos métodos, como o exemplo abaixo:
 */

class MetodoPagamento {
  pagar(pagamento: string, orderId: string) {
    if ((pagamento = 'boleto')) {
      // código relacionado ao pagamento com boleto
    } else if ((pagamento = 'pix')) {
      // código relacionado ao pagamento com pix
    } else if ((pagamento = 'paypal')) {
      // código relacionado ao pagamento com paypal
    } else if ((pagamento = 'pagseguro')) {
      // código relacionado ao pagamento com pagseguro
    }
  }

  reembolsar(pagamento: string, orderId: string) {
    if ((pagamento = 'boleto')) {
      // código relacionado ao pagamento com boleto
    } else if ((pagamento = 'pix')) {
      // código relacionado ao pagamento com pix
    } else if ((pagamento = 'paypal')) {
      // código relacionado ao pagamento com paypal
    } else if ((pagamento = 'pagseguro')) {
      // código relacionado ao pagamento com pagseguro
    }
  }
}

/**
 * Para isso vem o Design Pattern "Factory Method" ("Método de Fábrica"), onde
 * sugere a criação de uma única interface para pagamento (que será implementada
 * por qualquer classe de pagamento), uma classe abstrata para criação dos objetos
 * dessas classes de pagamento (imaginando que depois de meses é preciso adicionar
 * proriedades ao construtor dao pagamento com pix, ao invés de mudar em várias
 * áreas do código onde a classe do pix seria instanciada, muda somente em um
 * local, na classe concreta que extende a classe abstrata que cria um objeto
 * daquele pagamento). Essa classe abstrata para criação de objetos é chamada de
 * fábrica (factory), e o objeto então (a instância da classe que implementou a
 * interface), é chamada de produto.
 */

// Interfaces e classes abstratas
interface PaymentMethod {
  tax: number;
  createPayment(orderId: string): boolean;
  refounfPayment(orderId: string): boolean;
}

abstract class PaymentMethodFactory {
  abstract create(): PaymentMethod;
}

// Concretos
class PaypalMethod implements PaymentMethod {
  tax: number = 0.05;

  createPayment(orderId: string): boolean {
    // do something
    console.log(
      `Cria ordem de pagamento ${orderId} via Paypal com taxa ${this.tax}`
    );
    return true;
  }

  refounfPayment(orderId: string): boolean {
    // do something
    console.log(`Reemvola a ordem de pagamento ${orderId} via Paypal`);
    return true;
  }
}

class PaypalMethodFactory extends PaymentMethodFactory {
  create(): PaymentMethod {
    return new PaypalMethod();
  }
}

class PagseguroMethod implements PaymentMethod {
  tax: number = 0.02;

  createPayment(orderId: string): boolean {
    // do something
    console.log(
      `Cria ordem de pagamento ${orderId} via Pagseguro com taxa ${this.tax}`
    );
    return true;
  }

  refounfPayment(orderId: string): boolean {
    // do something
    console.log(`Reemvola a ordem de pagamento ${orderId} via Pagseguro`);
    return true;
  }
}

class PagseguroMethodFactory extends PaymentMethodFactory {
  create(): PaymentMethod {
    return new PagseguroMethod();
  }
}

// Código cliente
function clientCode() {
  let paymentMethod: PaymentMethod;

  // Paypal payment
  const paypalMethodFactory = new PaypalMethodFactory();
  paymentMethod = paypalMethodFactory.create();
  paymentMethod.createPayment('Ordem 01');

  // Pagseguro payment
  const pagseguroMethodFactory = new PagseguroMethodFactory();
  paymentMethod = pagseguroMethodFactory.create();
  paymentMethod.createPayment('Ordem 02');
}

clientCode();

/** Prós e Contras do Factory Method:
 * -----------------------------------------------------------------------------
 * PRÓS
 *    1. Evita acoplamentos firmes entre o criador e seus produtos concretos
 *    (tem uma factory para cada pagamento)
 *
 *    2. Corrobora com o princípio de responsabilidade única.
 *    Pode mover o código de criação do produto pra um único local,facilitando a
 *    manutenção (se algo mudar, só impacta na alteração de código em um lugar só)
 *
 *    3. Corrobora com o princípio aberto/fechado.
 *    Introduzir novos tipos de produtos no programa sem quebrar o código já
 *    existente (adicionar/remover pagamentos sem interferir no que já existia)
 *
 * -----------------------------------------------------------------------------
 * CONTRAS
 *    O código pode se tornar mais complicado por conta da criação de muitas novas
 *    subclasses que sustentarão o padrão
 */

/** Bônus: Factory Functions
 *  - Para algo mais rápido e que garanta que as instâncias estarão certas
 */
class DatabaseInstance {}
class EmiteNotaFiscalUseCase {}

class AddNewOrderUseCase {
  constructor(a: DatabaseInstance, b: EmiteNotaFiscalUseCase) {}
}

function makeDatabaseInstance() {
  return new DatabaseInstance();
}

function makeEmiteNotaFiscalUseCase() {
  return new EmiteNotaFiscalUseCase();
}

function makeAddNewOrderUseCase() {
  return new AddNewOrderUseCase(
    makeDatabaseInstance(),
    makeEmiteNotaFiscalUseCase()
  );
}

const useCase = makeAddNewOrderUseCase();

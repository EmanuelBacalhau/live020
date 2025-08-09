import type { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  // PODEMOS COLOCAR ALGUM HTML NOS EMAILS E EDITAR COMO BEM ENTENDER MELHOR
  // event.response.emailSubject = 'Assunto do email';
  // event.response.emailMessage = 'Mensagem do email';
  // event.response.smsMessage = 'Mensagem SMS';
  // Exemplo de como enviar o código de verificação no email
  // event.response.emailMessage = `<h1>Olá</h1><p>${event.request.codeParameter}</p>`;

  if (event.triggerSource === 'CustomMessage_SignUp') {
    const { given_name: givenName } = event.request.userAttributes;
    event.response.emailSubject = `Bem-vindo(a) ${givenName}`
    event.response.emailMessage = `Olá ${givenName}, obrigado por se cadastrar! Seu código de verificação é ${event.request.codeParameter}`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de senha'
    event.response.emailMessage = `Seu código para recuperação de senha é ${event.request.codeParameter}`;
  }

  return event;
}

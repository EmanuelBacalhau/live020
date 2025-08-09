import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParse } from '@/utils/bodyParse';
import { response } from '@/utils/response';
import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email } = bodyParse(event.body);

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    })

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    return response(500, { message: 'Internal server error' });
  }
}

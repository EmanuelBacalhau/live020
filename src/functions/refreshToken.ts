import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParse } from '@/utils/bodyParse';
import { response } from '@/utils/response';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';


export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken } = bodyParse(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      }
    })

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { message: 'Invalid credentials' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    })
  } catch (error) {
    return response(500, { message: 'Internal server error' });
  }
}

import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParse } from '@/utils/bodyParse';
import { response } from '@/utils/response';
import { InitiateAuthCommand, UsernameExistsException, UserNotConfirmedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';


export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, password } = bodyParse(event.body);

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
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
    console.log('Error during sign in:', error);

    if (error instanceof UserNotFoundException) {
      return response(401, { message: 'Invalid credentials' });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, { message: 'You need to confirm your account before sign in' });
    }

    return response(500, { message: 'Internal server error' });
  }
}

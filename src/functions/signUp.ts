import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { bodyParse } from '@/utils/bodyParse';
import { response } from '@/utils/response';
import { SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognitoClient';


export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParse(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: body.firstName
        },
        {
          Name: 'family_name',
          Value: body.lastName
        },
      ]
    })

    const { UserSub } = await cognitoClient.send(command);

    return response(201, { id: UserSub });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, { message: 'User already exists' });
    }

    return response(500, { message: 'Internal server error' });
  }
}

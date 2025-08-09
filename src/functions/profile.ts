import { cognitoClient } from '@/libs/cognitoClient';
import { response } from '@/utils/response';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const userId = event.requestContext.authorizer.jwt.claims.sub

  const command = new AdminGetUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userId as string,
  })

  const {  UserAttributes } = await cognitoClient.send(command);

  const profile = UserAttributes?.reduce((acc, { Name, Value }) => {
    const key = Name as string
    const keyMap = {
      given_name: 'firstName',
      family_name: 'lastName',
      sub: 'id',
      email_verified: 'emailVerified',
      email: 'email',
    }

    return {
      ...acc,
      [keyMap[key as keyof typeof keyMap]]: Value,
    }

  }, {} as any)

  return response(200, { profile });
}

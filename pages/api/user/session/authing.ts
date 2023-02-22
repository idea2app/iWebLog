import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { HTTPError, Response } from 'koajax';
import { NextApiRequest } from 'next';

import { readyDB } from '../../../../service/database';
import { Role } from '../../../../service/type';
import { User, UserData } from '../../../../service/User/entity';
import { safeAPI } from '../../core';

export type AuthingAddress = Partial<
  Record<'country' | 'postal_code' | 'region' | 'formatted', string>
>;

export type AuthingUser = Record<
  'type' | 'userPoolId' | 'appId' | 'id' | '_id' | 'userId' | 'clientId',
  string
> &
  Partial<
    Record<'email' | 'phone' | 'username' | 'unionid' | 'openid', string>
  >;

export interface AuthingSession
  extends Pick<AuthingUser, 'username' | 'unionid'>,
    Record<'userpool_id' | 'gender' | 'picture', string>,
    Partial<
      Record<
        | 'external_id'
        | 'email'
        | 'website'
        | 'phone_number'
        | 'name'
        | 'preferred_username'
        | 'nickname'
        | 'family_name'
        | 'middle_name'
        | 'given_name'
        | 'birthdate'
        | 'locale'
        | 'zoneinfo',
        string
      >
    > {
  phone_number_verified: boolean;
  email_verified: boolean;

  data: AuthingUser;
  profile?: any;
  address: AuthingAddress;

  updated_at: Date;
}

const AUTHING_APP_SECRET = process.env.AUTHING_APP_SECRET!;

export function parseJWT<T>({ headers: { authorization } }: NextApiRequest) {
  if (!authorization)
    throw new HTTPError('Authorization header is missing', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
    });
  const [type, token] = authorization.split(/\s+/);

  return verify(token, AUTHING_APP_SECRET) as JwtPayload & T;
}

export function verifyJWT(
  request: NextApiRequest,
  requiredRoles: Role[],
  { status, statusText }: Pick<Response, 'status' | 'statusText'>,
) {
  const user = parseJWT<UserData>(request);

  if (!requiredRoles.some(role => user.roles?.includes(role)))
    throw new HTTPError('Forbidden', { status, statusText, headers: {} });

  return user;
}

export default safeAPI(async (request, response) => {
  await readyDB;

  switch (request.method) {
    case 'POST': {
      let staticUser = parseJWT<AuthingSession | UserData>(request);

      if ('phone_number' in staticUser) {
        const {
          phone_number: mobilePhone,
          nickname,
          picture,
        } = staticUser as AuthingSession;

        let user = await User.findOne({ where: { mobilePhone } });

        if (user) await user.update({ nickname, picture });
        else {
          const sum = await User.count();

          await User.create({
            mobilePhone,
            nickname,
            picture,
            roles: [sum ? Role.Reader : Role.Editor],
          });
        }
        user = await User.findOne({ where: { mobilePhone } });
        staticUser = user!.toJSON();
      }

      response.json({
        ...staticUser,
        token: sign(staticUser, AUTHING_APP_SECRET),
      });
    }
  }
});

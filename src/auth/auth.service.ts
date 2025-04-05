import 'reflect-metadata';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { User } from 'src/users';
// import { contentSecurityPolicy } from 'helmet';
type TokenResponse = {
  token_type: string;
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(payload: {
    name: string;
    email?: string | null;
    password: string;
  }) {
    const user = await this.usersService.findOne(payload.name);

    if (user) {
      throw new BadRequestException('User with such name already exists');
    }

    const { id: userId } = await this.usersService.createOne(payload);
    return { userId };
  }

  async validateUser(name: string, password: string) {
    const user = await this.usersService.findOne(name);

    if (user) {
      return user;
    }

    return await this.usersService.createOne({ name, password });
  }

  async login(
    user: User,
    type: 'jwt' | 'basic' | 'default',
  ): Promise<TokenResponse> {
    const LOGIN_MAP = {
      jwt: this.loginJWT,
      basic: this.loginBasic,
      default: this.loginJWT,
    };
    const login = LOGIN_MAP[type];

    return login ? login(user) : LOGIN_MAP.default(user);
  }

  async loginJWT(user: User) {
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginBasic(user: User) {
    // const payload = { username: user.name, sub: user.id };

    function encodeUserToken(user: User) {
      const { name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}

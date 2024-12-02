import { Module, Provider } from '@nestjs/common';
import { config } from 'src/share';
import { JwtTokenService } from 'src/share/components/jwt';
import { ShareModule } from 'src/share/module';
import { UserHttpController, UserRpcHttpController } from './user-http.controller';
import { UserPrismaRepository } from './user-prisma.repo';
import { TOKEN_PROVIDER, USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserService } from './user.service';

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
];

const services: Provider[] = [
  { provide: USER_SERVICE, useClass: UserService },
];

const tokenJWTProvider = new JwtTokenService(config.rpc.jwtSecret, '7d');
const tokenProvider: Provider = { provide: TOKEN_PROVIDER, useValue: tokenJWTProvider };

@Module({
  imports: [ShareModule],
  controllers: [UserHttpController, UserRpcHttpController],
  providers: [...repositories, ...services, tokenProvider],
})

export class UserModule {}

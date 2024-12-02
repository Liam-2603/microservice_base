import { Inject, Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { AppError, ErrForbidden, ErrNotFound, ITokenProvider, Requester, TokenPayload, UserRole } from "src/share";
import { v7 } from "uuid";
import { TOKEN_PROVIDER, USER_REPOSITORY } from "./user.di-token";
import { UserLoginDTO, userLoginDTOSchema, UserRegistrationDTO, userRegistrationDTOSchema, UserUpdateDTO, userUpdateDTOSchema } from "./user.dto";
import { ErrInvalidToken, ErrInvalidUsernameAndPassword, ErrUserInactivated, ErrUsernameExisted, Status, User } from "./user.model";
import { IUserRepository, IUserService } from "./user.port";

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: ITokenProvider,
  ) { }

  async register(dto: UserRegistrationDTO): Promise<string> {
    const data = userRegistrationDTOSchema.parse(dto);

    // 1. Check username existed
    const user = await this.userRepo.findByCond({ username: data.username });
    if (user) throw AppError.from(ErrUsernameExisted, 400);

    // 2. Gen salt and hash password
    // const salt = generateRandomString(20);
    const salt = bcrypt.genSaltSync(8);
    const hashPassword = await bcrypt.hash(`${data.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...data,
      password: hashPassword,
      id: newId,
      status: Status.ACTIVE,
      salt: salt,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      followerCount: 0,
      postCount: 0,
    };

    // 4. Insert new user to database
    await this.userRepo.insert(newUser);
    return newId;
  }

  async login(dto: UserLoginDTO): Promise<string> {
    const data = userLoginDTOSchema.parse(dto);

    // 1. Find user with username from DTO
    const user = await this.userRepo.findByCond({ username: dto.username });
    if (!user) {
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Username not found');
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(`${dto.password}.${user.salt}`, user.password);
    if (!isMatch) {
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Password is incorrect');
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    // 3. Return token
    const role = user.role;
    const token = await this.tokenProvider.generateToken({ sub: user.id, role });
    return token;
  }

  async introspectToken(token: string): Promise<TokenPayload> {
    const payload = await this.tokenProvider.verifyToken(token);

    if (!payload) {
      throw AppError.from(ErrInvalidToken, 400);
    }

    const user = await this.userRepo.get(payload.sub);
    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE || user.status === Status.BANNED) {
      throw AppError.from(ErrUserInactivated, 400);
    }

    return {
      sub: user.id,
      role: user.role,
    };
  }

  async profile(userId: string): Promise<Omit<User, 'password' | 'salt'>> {
    const user = await this.userRepo.get(userId);
    
    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    const { password, salt, ...rest } = user;
    return rest;
  }

  async update(requester: Requester, userId: string, dto: UserUpdateDTO): Promise<void> {
    if (requester.role !== UserRole.ADMIN && requester.sub !== userId) {
      throw AppError.from(ErrForbidden, 400);
    }

    const data = userUpdateDTOSchema.parse(dto);

    const user = await this.userRepo.get(userId);
    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    await this.userRepo.update(userId, data);
  }

  async delete(requester: Requester, userId: string): Promise<void> {
    if (requester.role !== UserRole.ADMIN && requester.sub !== userId) {
      throw AppError.from(ErrForbidden, 400);
    }

    // soft delete
    await this.userRepo.delete(userId, false);
  }
}

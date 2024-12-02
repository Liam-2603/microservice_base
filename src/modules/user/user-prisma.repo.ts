import { Injectable } from "@nestjs/common";
import { User as UserPrisma } from "@prisma/client";
import { UserRole } from "src/share";
import prisma from "src/share/components/prisma";
import { UserCondDTO, UserUpdateDTO } from "./user.dto";
import { Status, User } from "./user.model";
import { IUserRepository } from "./user.port";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  async get(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { id } });
    if (!data) return null;

    return this._toModel(data);
  }

  async findByCond(cond: UserCondDTO): Promise<User | null> {
    const data = await prisma.user.findFirst({ where: cond });
    if (!data) return null;

    return this._toModel(data);
  }

  async insert(user: User): Promise<void> {
    await prisma.user.create({ data: user });
  }

  async listByIds(ids: string[]): Promise<User[]> {
    const data = await prisma.user.findMany({ where: { id: { in: ids } } });
    return data.map(this._toModel);
  }

  async update(id: string, dto: UserUpdateDTO): Promise<void> {
    await prisma.user.update({ where: { id }, data: dto });
  }

  async delete(id: string, isHard: boolean): Promise<void> {
    (isHard) ? 
      await prisma.user.delete({ where: { id } }) :
      await prisma.user.update({ where: { id }, data: { status: Status.DELETED } });
  }

  private _toModel(data: UserPrisma): User {
    return { ...data, role: data.role as UserRole } as User;
  }
}

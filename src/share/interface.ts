import { AppEvent, Post, PublicUser, Topic } from "./data-model";

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface Requester extends TokenPayload { }

export interface ReqWithRequester { requester: Requester; }
export interface ReqWithRequesterOpt { requester?: Requester; }

export interface ITokenProvider {
  // generate access token
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IPostRpc {
  findById(id: string): Promise<Post | null>;
  findByIds(ids: Array<string>): Promise<Array<Post>>;
}
export interface IAuthorRpc {
  findById(id: string): Promise<PublicUser | null>;
  findByIds(ids: Array<string>): Promise<Array<PublicUser>>;
}

export interface ITopicRPC {
  findById(id: string): Promise<Topic | null>;
  findAll(): Promise<Array<Topic>>;
}

export interface IPublicUserRpc extends IAuthorRpc { }


export type EventHandler = (msg: string) => void;



export interface IEventPublisher {
  publish<T>(event: AppEvent<T>): Promise<void>;
}
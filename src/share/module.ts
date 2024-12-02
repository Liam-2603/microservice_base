import { Module, Provider } from "@nestjs/common";
import { RedisClient } from "./components";
import { config } from "./config";
import { EVENT_PUBLISHER, POST_RPC, TOKEN_INTROSPECTOR, USER_RPC } from "./di-token";
import { PostRPCClient, TokenIntrospectRPCClient, UserRPCClient } from "./rpc";

const tokenRPCClient = new TokenIntrospectRPCClient(config.rpc.introspectUrl);
const tokenIntrospector: Provider = {
  provide: TOKEN_INTROSPECTOR,
  useValue: tokenRPCClient,
};

const userRPCClient = new UserRPCClient(config.rpc.userServiceURL);
const userRPC: Provider = {
  provide: USER_RPC,
  useValue: userRPCClient,
};

const postRPCClient = new PostRPCClient(config.rpc.postServiceURL);
const postRPC: Provider = {
  provide: POST_RPC,
  useValue: postRPCClient,
};

const redisClient: Provider = {
  provide: EVENT_PUBLISHER,
  useFactory: async () => {
    await RedisClient.init(config.redis.url);
    return RedisClient.getInstance();
  }
};

@Module({
  providers: [tokenIntrospector, userRPC, postRPC, redisClient],
  exports: [tokenIntrospector, userRPC, postRPC, redisClient]
})

export class ShareModule { }

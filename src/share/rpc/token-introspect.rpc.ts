import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ITokenIntrospect, TokenIntrospectResult } from "../interface";

// 200Lab Note: we might use HTTP Module of NestJS instead of axios directly
// but for now, we use axios to make it simple
@Injectable()
export class TokenIntrospectRPCClient implements ITokenIntrospect {
  constructor(private readonly url: string) { }

  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const { data } = await axios.post(`${this.url}`, { token });
      const { sub, role } = data.data;
      return {
        payload: { sub, role },
        isOk: true,
      };
    } catch (error) {
      return {
        payload: null,
        error: (error as Error),
        isOk: false,
      };
    }
  }
}
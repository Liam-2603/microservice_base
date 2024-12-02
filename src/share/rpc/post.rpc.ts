import { Injectable } from "@nestjs/common";
import axios from "axios";
import { IPostRpc, Post } from "..";

@Injectable()
export class PostRPCClient implements IPostRpc {
  constructor(private readonly postServiceUrl: string) { }

  async findById(id: string): Promise<Post | null> {
    try {
      const { data } = await axios.get(`${this.postServiceUrl}/rpc/posts/${id}`);

      if (data) return data.data;
      return null;
    } catch (error) {
      return null;
    }
  }

  async findByIds(ids: Array<string>): Promise<Array<Post>> {
    try {
      const { data } = await axios.post(`${this.postServiceUrl}/rpc/posts/list-by-ids`, { ids });
      return data.data;

    } catch (error) {
      return [];
    }
  }
}
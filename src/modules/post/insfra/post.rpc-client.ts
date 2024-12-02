import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Topic, topicSchema } from "../model";
import { IPostLikedRPC, IPostSavedRPC, ITopicQueryRPC } from "../post.port";

@Injectable()
export class TopicQueryRPC implements ITopicQueryRPC {
  constructor(private readonly topicServiceUrl: string) { }
  async findById(id: string): Promise<Topic | null> {
    try {
      const { data } = await axios.get(`${this.topicServiceUrl}/rpc/topics/${id}`);
      const dataParse = topicSchema.parse(data.data);

      return {
        id: dataParse.id,
        name: dataParse.name,
        postCount: dataParse.postCount,
        color: dataParse.color,
      } as Topic;
    } catch (error) {
      return null;
    }
  }

  async findByIds(ids: Array<string>): Promise<Array<Topic>> {
    try {
      const { data } = await axios.post(`${this.topicServiceUrl}/rpc/topics/list-by-ids`, { ids });

      return data.data.map((item: any) => {
        const dataParse = topicSchema.parse(item);

        return {
          id: dataParse.id,
          name: dataParse.name,
          postCount: dataParse.postCount,
          color: dataParse.color,
        } as Topic;
      });
    } catch (error) {
      return [];
    }
  }
}

@Injectable()
export class PostLikedRPC implements IPostLikedRPC {
  constructor(private readonly postLikedServiceUrl: string) { }

  async hasLikedId(userId: string, postId: string): Promise<boolean> {
    try {
      const { data } = await axios.post(`${this.postLikedServiceUrl}/rpc/has-liked`, { userId, postId });
      return data.data;
    } catch (error) {
      return false;
    }
  }

  async listPostIdsLiked(userId: string, postIds: string[]): Promise<Array<string>> {
    try {
      const { data } = await axios.post(`${this.postLikedServiceUrl}/rpc/list-post-ids-liked`, { userId, postIds });
      return data.data;
    } catch (error) {
      return [];
    }
  }
}

@Injectable()
export class PostSavedRPC implements IPostSavedRPC {
  constructor(private readonly postSavedServiceUrl: string) { }

  async hasSavedId(userId: string, postId: string): Promise<boolean> {
    try {
      const { data } = await axios.post(`${this.postSavedServiceUrl}/rpc/has-saved`, { userId, postId });
      return data.data;
    } catch (error) {
      return false;
    }
  }

  async listPostIdsSaved(userId: string, postIds: string[]): Promise<Array<string>> {
    try {
      const { data } = await axios.post(`${this.postSavedServiceUrl}/rpc/list-post-ids-saved`, { userId, postIds });
      return data.data;
    } catch (error) {
      return [];
    }
  }
}
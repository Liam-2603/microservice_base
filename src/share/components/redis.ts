import { Logger } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { EventHandler } from "..";
import { AppEvent } from "../data-model";
import { IEventPublisher } from "../interface";

export class RedisClient implements IEventPublisher {
  private static instance: RedisClient;

  redisClient: RedisClientType;
  private subscriberMap: Record<string, RedisClientType[]> = {};

  private constructor(connectionUrl: string) {
    const url = connectionUrl;
    this.redisClient = createClient({ url });
  }

  public static async init(connectionUrl: string) {
    if (!this.instance) {
      this.instance = new RedisClient(connectionUrl);
      await this.instance._connect();
    }
  }

  public static getInstance(): RedisClient {
    if (!this.instance) {
      throw new Error('RedisClient instance not initialized');
    }

    return this.instance;
  }

  private async _connect(): Promise<void> {
    try {
      await this.redisClient.connect();
      Logger.log('Connected to redis server');
    } catch (error) {
      Logger.error((error as Error).message);
    }
  }

  public async publish<T>(event: AppEvent<T>): Promise<void> {
    try {
      await this.redisClient.publish(event.eventName, JSON.stringify(event.plainObject()));
    } catch (err) {
      Logger.error((err as Error).message);
    }
  }

  public async subscribe(topic: string, fn: EventHandler): Promise<void> {
    try {
      const subscriber = this.redisClient.duplicate();
      await subscriber.connect();
      await subscriber.subscribe(topic, fn);

      const subs = this.subscriberMap[topic] || [];
      this.subscriberMap[topic] = [...subs, subscriber];
    } catch (error) {
      Logger.error((error as Error).message);
    }
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
    Logger.log('Disconnected redis server');
  }
}
import { Paginated, PagingDTO, Requester } from "src/share";
import { Notification, NotificationCondition, NotificationCreateDTO, NotificationUpdateDTO } from "./notification.model";

export type NotiPaginated = Paginated<Notification> & {
  unreadCount: number;
};

export interface INotificationService {
  create(dto: NotificationCreateDTO): Promise<string>;
  list(cond: NotificationCondition, paging: PagingDTO): Promise<Paginated<Notification>>;
  read(id: string, requester: Requester): Promise<boolean>;
  readAll(requester: Requester): Promise<boolean>;
}

export interface INotificationRepository {
  insert(data: Notification): Promise<boolean>;
  update(id: string, dto: NotificationUpdateDTO): Promise<boolean>;
  get(id: string): Promise<Notification | null>;
  list(cond: NotificationCondition, paging: PagingDTO): Promise<NotiPaginated>;
  readAll(receiverId: string): Promise<boolean>;
}
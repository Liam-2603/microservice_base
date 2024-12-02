import { AppEvent } from "..";

export const EvtFollowed = 'Followed';
export const EvtUnfollowed = 'Unfollowed';

export type FollowUnfollowPayload = {
  followingId: string;
};

export class FollowedEvent extends AppEvent<FollowUnfollowPayload> {
  static create(payload: FollowUnfollowPayload, senderId: string) {
    return new FollowedEvent(EvtFollowed, payload, { senderId });
  }

  static from(json: any) {
    const { eventName, payload, id, occurredAt, senderId } = json;
    return new FollowedEvent(eventName, payload, { id, occurredAt, senderId });
  }
}

export class UnfollowedEvent extends AppEvent<FollowUnfollowPayload> {
  static create(payload: FollowUnfollowPayload, senderId: string) {
    return new UnfollowedEvent(EvtUnfollowed, payload, { senderId });
  }

  static from(json: any) {
    const { eventName, payload, id, occurredAt, senderId } = json;
    return new UnfollowedEvent(eventName, payload, { id, occurredAt, senderId });
  }
}
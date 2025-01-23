import type { Status } from "@/enums/friendship";

export type Friendship = {
  id: string;
  requesterName: string;
  addresseeName: string;
  status: Status;
};
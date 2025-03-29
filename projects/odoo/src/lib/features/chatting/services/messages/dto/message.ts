export interface Message {
  id?: number;
  body: string;
  res_id: number;
  model: string;
  message_type: string;

  attachment_ids?: number[];
}

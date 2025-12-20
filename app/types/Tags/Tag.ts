import type { WithUid } from '~/types/utils';

export interface Tag {
  userUid: string;
  content: string;
  belongsTo: string[];
}

export type TagWithUid = WithUid<Tag>;

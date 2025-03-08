export type RichText = RichStructure[];

export interface RichStructure {
  type: 'paragraph' | 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: RichTextChildren[];
}

export type RichTextChildren = RichParagraphText | RichParagraphLink;

export type RichParagraphText = {
  bold: boolean;
  underline: boolean;
  italic: boolean;
  text: string;
  type: 'text';
};

export type RichParagraphLink = {
  children: RichParagraphText[];
  type: 'link';
  url: string;
};

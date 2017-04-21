export class Black {
  key: string;
  name: string;
  img: string;
  tags: string[] = [];
  descriptions: string[] = [];
  notes: BlackNote[] = [];
}

export class BlackNote {
  note: string;
  img: string;
  owner: string;
}

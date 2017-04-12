export class People {
  name: string = '';
  buy: Map<string, number> = new Map<string, number>();

  constructor(name: string) {
    this.name = name;
  }
  total: number = 0;

  initialize() {
    if (!this.buy) this.buy = new Map<string, number>();
  }
}

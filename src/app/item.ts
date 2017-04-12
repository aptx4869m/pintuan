export class Item {
  name: string = '';
  img: string = '';
  price: number = 0;
  stock: number= 0;
  total: number = 0;

  constructor(name: string) {
    this.name = name;
  }
}

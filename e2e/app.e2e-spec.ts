import { PintuanPage } from './app.po';

describe('pintuan App', () => {
  let page: PintuanPage;

  beforeEach(() => {
    page = new PintuanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

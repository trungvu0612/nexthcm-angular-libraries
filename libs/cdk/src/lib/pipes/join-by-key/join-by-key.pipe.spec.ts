import { JoinByKeyPipe } from './join-by-key.pipe';

describe('JoinByKeyPipe', () => {
  it('create an instance', () => {
    const pipe = new JoinByKeyPipe();
    expect(pipe).toBeTruthy();
  });
});

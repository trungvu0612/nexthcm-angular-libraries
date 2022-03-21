import { CronNextRunTimePipe } from './cron-next-run-time.pipe';

describe('CronNextRunTimePipe', () => {
  it('create an instance', () => {
    const pipe = new CronNextRunTimePipe();
    expect(pipe).toBeTruthy();
  });
});

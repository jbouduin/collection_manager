export abstract class BaseAdapter {
  protected booleanToNumber(value: boolean): number {
    return value ? 0 : 1;
  }
}

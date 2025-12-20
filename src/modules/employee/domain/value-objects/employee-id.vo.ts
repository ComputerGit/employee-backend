export class EmployeeId {
  private constructor(private readonly value: string) {}

  static create(value: string): EmployeeId {
    if (!value.startsWith('EMP-')) {
      throw new Error('Invalid EmployeeId format');
    }
    return new EmployeeId(value);
  }

  getValue(): string {
    return this.value;
  }
}

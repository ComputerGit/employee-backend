export enum EmployeeRoleType {
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  IT = 'IT',
  HR = 'HR',
}

export class EmployeeRole {
  private constructor(private readonly value: EmployeeRoleType) {}

  static create(role: string): EmployeeRole {
    if (!Object.values(EmployeeRoleType).includes(role as EmployeeRoleType)) {
      throw new Error(`Invalid employee role: ${role}`);
    }
    return new EmployeeRole(role as EmployeeRoleType);
  }

  getValue(): EmployeeRoleType {
    return this.value;
  }
}

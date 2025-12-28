// src/modules/employee/domain/entities/employee.entity.ts
import { EmployeeId } from '../value-objects/employee-id.vo';
import { EmployeeRole } from '../value-objects/employee-role.vo';
import { EmployeeStatus } from '../value-objects/employee-status.enum';
import { Name } from '../value-objects/name.vo';
import { Address } from '../value-objects/address.vo';

export class Employee {
  private constructor(
    public readonly id: EmployeeId,
    public readonly name: Name,
    public readonly role: EmployeeRole,
    public readonly addresses: Address[],
    public readonly status: EmployeeStatus,
  ) {}

  static create(props: {
    id: EmployeeId;
    name: Name;
    role: EmployeeRole;
    addresses: Address[];
  }): Employee {
    return new Employee(
      props.id,
      props.name,
      props.role,
      props.addresses,
      EmployeeStatus.ACTIVE,
    );
  }

  // ✅ ADD THIS
  static fromPersistence(props: {
    id: EmployeeId;
    name: Name;
    role: EmployeeRole;
    addresses: Address[];
    status: EmployeeStatus;
  }): Employee {
    return new Employee(
      props.id,
      props.name,
      props.role,
      props.addresses,
      props.status,
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { EmployeeIdGenerator } from '../../infrastructure/identity/employee-id.generator';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { Name } from '../../domain/value-objects/name.vo';
import { EmployeeRole } from '../../domain/value-objects/employee-role.vo';

@Injectable()
export class CreateEmployeeService {
  constructor(
    private readonly idGenerator: EmployeeIdGenerator,

    @Inject('EmployeeRepository')
    private readonly repository: EmployeeRepository,
  ) {}

  async execute(dto: any, countryCode: string) {
    const employeeId = await this.idGenerator.generate(countryCode);

    const employee = Employee.create({
      id: employeeId,
      name: Name.create(dto.firstName, dto.lastName, dto.middleName),
      role: EmployeeRole.create(dto.role),
      addresses: dto.addresses,
    });

    await this.repository.save(employee);

    return employee;
  }
}

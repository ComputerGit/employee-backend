import { Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';
import type { Employee } from '../../domain/entities/employee.entity';

@Injectable()
export class RetrieveEmployeesService {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async retrieveAll(): Promise<Employee[]> {
    console.log('Starting retrieveAll... AT SERVICE');
    return await this.employeeRepository.retrieveAll();
  }
}

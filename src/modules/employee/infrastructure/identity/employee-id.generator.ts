import { Injectable } from '@nestjs/common';
import { EmployeeId } from '../../domain/value-objects/employee-id.vo';
import { EmployeeSequenceRepository } from '../persistence/mongo/employee-sequence.repository';

@Injectable()
export class EmployeeIdGenerator {
  constructor(private readonly sequenceRepo: EmployeeSequenceRepository) {}

  async generate(countryCode: string): Promise<EmployeeId> {
    console.log('sequenceRepo:', this.sequenceRepo);
    const seq = await this.sequenceRepo.next();
    const code = `EMP-${countryCode}-SE-${String(seq).padStart(6, '0')}`;
    return EmployeeId.create(code);
  }
}

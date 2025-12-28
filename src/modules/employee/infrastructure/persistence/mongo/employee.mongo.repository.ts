import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EmployeeRepository } from '../../../domain/repositories/employee.repository';
import { Employee } from '../../../domain/entities/employee.entity';

import { EmployeeId } from '../../../domain/value-objects/employee-id.vo';
import { Name } from '../../../domain/value-objects/name.vo';
import { EmployeeRole } from '../../../domain/value-objects/employee-role.vo';
import { Address, AddressType } from '../../../domain/value-objects/address.vo';
import { EmployeeStatus } from '../../../domain/value-objects/employee-status.enum';

import { EmployeeDocument } from './employee.schema';

@Injectable()
export class EmployeeMongoRepository implements EmployeeRepository {
  constructor(
    @InjectModel(EmployeeDocument.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async retrieveAll(): Promise<Employee[]> {
    // Fetch all employee documents from MongoDB
    console.log('Starting retrieveAll... at emp-mongo-repo');
    const employeeDocs = await this.employeeModel.find().exec();
    console.log('Found documents:', employeeDocs.length);

    // Transform each persistence model into a domain entity
    try {
      return employeeDocs.map((doc, index) => {
        console.log(`Processing doc ${index}:`, doc.employeeCode);

        return Employee.fromPersistence({
          id: EmployeeId.create(doc.employeeCode),
          name: Name.create(doc.firstName, doc.lastName, doc.middleName),
          role: EmployeeRole.create(doc.role),
          addresses: doc.addresses.map((addr) =>
            Address.create({
              type: addr.type as AddressType,
              line1: addr.line1,
              line2: addr.line2,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
              country: addr.country,
            }),
          ),
          status: doc.status as EmployeeStatus,
        });
      });
    } catch (error) {
      console.error('Error in retrieveAll:', error);
      throw error;
    }
  }
  async save(employee: Employee): Promise<Employee> {
    /* ================================
       DOMAIN → PERSISTENCE
       ================================ */

    const created = new this.employeeModel({
      employeeCode: employee.id.getValue(),

      firstName: employee.name.firstName,
      lastName: employee.name.lastName,
      middleName: employee.name.middleName,

      role: employee.role.getValue(),

      addresses: employee.addresses.map((addr) => ({
        type: addr.type,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      })),

      status: employee.status,
    });

    const saved = await created.save();

    /* ================================
       PERSISTENCE → DOMAIN
       ================================ */

    return Employee.fromPersistence({
      id: EmployeeId.create(saved.employeeCode),

      name: Name.create(saved.firstName, saved.lastName, saved.middleName),

      role: EmployeeRole.create(saved.role),

      addresses: saved.addresses.map((addr) =>
        Address.create({
          type: addr.type as AddressType,
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
        }),
      ),

      status: saved.status as EmployeeStatus,
    });
  }
}

import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import type { EmployeeRepository } from 'src/modules/employee/domain/repositories/employee.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  // Activate a new user account using only employee ID and password
  async activateUser(props: {
    employeeId: string;
    password: string;
  }): Promise<User> {
    // Step 1: Verify the employee exists in the employee collection
    const employees = await this.employeeRepository.retrieveAll();
    console.log('got EMPLOYEEs IN THE DB : ');
    const employeeExists = employees.some(
      (emp) => emp.id.getValue() === props.employeeId,
    );
    console.log('employee exists : ', employeeExists);

    if (!employeeExists) {
      throw new BadRequestException(
        'Employee ID not found. Please contact HR to register as an employee first.',
      );
    }

    // Step 2: Check if this employee has already activated their account
    const existingUser = await this.userRepository.findByEmployeeId(
      props.employeeId,
    );

    if (existingUser) {
      throw new ConflictException(
        'This employee has already activated their account. Please use the login endpoint instead.',
      );
    }

    // Step 3: Create the new user with employee ID as the username
    const user = await User.create({
      plainPassword: props.password,
      employeeId: props.employeeId,
    });
    console.log('creating a new : ', user.employeeId);
    return await this.userRepository.save(user);
  }

  // Find user by username - in your system, username is the employee ID
  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async updateLastLogin(user: User): Promise<User> {
    const updatedUser = user.updateLastLogin();
    return await this.userRepository.save(updatedUser);
  }

  async getEmployeeForUser(employeeId: string) {
    const employees = await this.employeeRepository.retrieveAll();
    return employees.find((emp) => emp.id.getValue() === employeeId);
  }
}

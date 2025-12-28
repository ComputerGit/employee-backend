import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from 'src/modules/user/application/services/user.service';
import type { EmployeeRepository } from 'src/modules/employee/domain/repositories/employee.repository';

// The AuthService handles authentication logic
// It verifies credentials and returns authenticated user information
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  // Validate user credentials during login
  // Returns the authenticated user data that will be stored in the session
  async validateUser(
    username: string,
    password: string,
  ): Promise<{
    userId: string;
    employeeId: string;
    role: string;
  }> {
    // Step 1: Find the user by their username
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Step 2: Check if the user's account is active and can log in
    if (!user.canLogin()) {
      throw new UnauthorizedException(
        'Your account is not active. Please contact support.',
      );
    }

    // Step 3: Verify the password matches
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Step 4: Update the last login timestamp
    await this.userService.updateLastLogin(user);

    // Step 5: Fetch the employee data to get their role
    // We need to bridge from the user domain to the employee domain here
    const employees = await this.employeeRepository.retrieveAll();
    const employee = employees.find(
      (emp) => emp.id.getValue() === user.employeeId,
    );

    if (!employee) {
      throw new UnauthorizedException('Employee data not found');
    }

    // Return the data that will be stored in the session
    return {
      userId: user.id.getValue(),
      employeeId: user.employeeId,
      role: employee.role.getValue(),
    };
  }
}

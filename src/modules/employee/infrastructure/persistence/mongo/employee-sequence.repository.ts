import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeSequenceDocument } from './employee-sequence.schema';

export class EmployeeSequenceRepository {
  constructor(
    @InjectModel(EmployeeSequenceDocument.name)
    private readonly model: Model<EmployeeSequenceDocument>,
  ) {}

  async next(): Promise<number> {
    const seq = await this.model.findOneAndUpdate(
      { name: 'employee' },
      { $inc: { value: 1 } },
      { new: true, upsert: true },
    );

    return seq.value;
  }
}

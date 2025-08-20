import { Schema, model } from 'mongoose';
import { IModule, ModuleModel } from '../interfaces/module.interface';

const ModuleSchema = new Schema<IModule, ModuleModel>(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
    },
    module_number: {
      type: Number
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);



// Auto-increment `module_number` per course
ModuleSchema.pre<IModule>('save', async function (next) {
  if (!this.isNew) return next();

  const lastModule = await Module.findOne({ course: this.course })
    .sort({ module_number: -1 })
    .exec();

  this.module_number = lastModule ? lastModule.module_number + 1 : 1;
  next();
});

export const Module = model<IModule, ModuleModel>('Module', ModuleSchema);

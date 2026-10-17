import mongoose from 'mongoose';

const demoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Demo title is required'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    animationType: {
      type: String,
      required: [true, 'Animation type is required'],
      enum: {
        values: ['particles', 'bouncing_balls', 'starfield', 'matrix_rain'],
        message: '{VALUE} is not a supported animation type'
      },
      default: 'particles'
    },
    parameters: {
      speed: {
        type: Number,
        default: 1.0,
        min: 0.1,
        max: 5.0
      },
      count: {
        type: Number,
        default: 80,
        min: 10,
        max: 300
      },
      colorScheme: {
        type: String,
        default: 'cyber-violet',
        enum: ['cyber-violet', 'matrix-green', 'electric-blue', 'sunset-amber', 'rainbow', 'neon-pink']
      },
      interactive: {
        type: Boolean,
        default: true
      }
    },
    tags: {
      type: [String],
      default: ['canvas', '2d', 'interactive']
    },
    author: {
      type: String,
      default: 'Anonymous Lab Developer',
      trim: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual index for searching
demoSchema.index({ title: 'text', description: 'text' });

const Demo = mongoose.model('Demo', demoSchema);

export default Demo;

import mongoose, { Schema, models } from 'mongoose';

const SliderSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
}, { timestamps: true });

const Slider = models.Slider || mongoose.model('Slider', SliderSchema);
export default Slider;
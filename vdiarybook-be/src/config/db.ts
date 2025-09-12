import mongoose from 'mongoose';

const connectDB = async () : Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/vdiarybook');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;
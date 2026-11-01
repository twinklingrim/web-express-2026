import mongoose from 'mongoose';
 
const connectDB = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test-app");
         
        console.log('Connected to MongoDB');
    } catch (error: { message: string}) {
        console.error('Error: ${error.message}' );
        process.exit(1); // Останавливаем процесс в случае ошибки подключения
    }
};

export default connectDB;
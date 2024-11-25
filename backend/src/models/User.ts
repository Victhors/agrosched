// // src/models/User.ts
// import mongoose from 'mongoose';
// import { Document } from 'mongoose';

// interface IUser extends Document {
//     email: string;
//     password: string;
//     name: string;
// }

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     }
// }, {
//     timestamps: true
// });

// const User = mongoose.model<IUser>('User', userSchema);

// export default User;
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import { encap } from '../../services/helper';
import Config from '../../environments/index';
// import HttpException from '../../utils/error.utils';

// const { Schema, model } = mongoose;
// ===================================
// Validate requests
// ===================================

export const addDepartment = {
    name: {
        isString: true,
        isLength:{
            options: {min:3}
        },
        errorMessage: 'Department name is required in request'
    }
}

// ===================================
// Departments schema to store in database
// ===================================

const departmentSchema = new Schema({
    name:{
        type: Schema.Types.String,
        required: true,
    },
    startDate: {
        type: Schema.Types.Date,
        default: Date.now()
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: true
    }
},{ versionKey: false, timestamps: true })

// ===================================
// Pre hook before saving it execute
// ===================================
departmentSchema.pre('save', async (next) => {
    const user: any = this;
    if(user.isModified('password')){
        user.password = await encap.hash(user.password);
    }
    next();
});

const Departments = model('departments', departmentSchema)
export default Departments;
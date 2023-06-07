const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  twofaEnabled: {
    type: Boolean,
    default: false,
  },
  twofaSecret: {
    type: String,
    default: "",
  },
});

UserSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };

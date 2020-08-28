import mongoose from "mongoose";

import { Password } from "../services/password";

// required propertires to create User
interface UserAttrs {
  email: string;
  password: string;
}

// User Model properties
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// User Document properties
interface UserDoc extends mongoose.Document, UserAttrs {}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        delete ret.password;

        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// using function for access to this
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));

    this.set("password", hashedPassword);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

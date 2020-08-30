import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// required propertires to create Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// Payment Document properties
interface PaymentDoc extends mongoose.Document, PaymentAttrs {}

// Payment Model properties
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },

    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

// using function for access to this
// paymentSchema.pre("save", async function (done) {
//   // conver number to string
//   done();
// });

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };

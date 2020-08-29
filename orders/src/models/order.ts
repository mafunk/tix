import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@mafunk/tix-common";

import { TicketDoc } from "./ticket";

// required propertires to create Order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;

  ticket: TicketDoc;
}

// Order Document properties
interface OrderDoc extends mongoose.Document, OrderAttrs {
  version: number;
}

// Order Model properties
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },

    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

// using function for access to this
// orderSchema.pre("save", async function (done) {
//   // conver number to string
//   done();
// });

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };

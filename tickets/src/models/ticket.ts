import mongoose from "mongoose";

// required propertires to create Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Ticket Model properties
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Ticket Document properties
interface TicketDoc extends mongoose.Document, TicketAttrs {}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    userId: {
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

// using function for access to this
// ticketSchema.pre("save", async function (done) {
//   // conver number to string
//   done();
// });

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

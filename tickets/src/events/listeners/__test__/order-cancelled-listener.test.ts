import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "ticket-common/build";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'fdjkas',
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    //@ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { message, data, ticket, orderId, listener };
};

it('updates the ticket, publishes an event , and acks the message', async () => {
    const { message , data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(message.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
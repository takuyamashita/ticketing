import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from 'ticket-common/build';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'fjeia',
    });
    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'fjdksafd',
        expiresAt: 'fjdksla',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, message };
};

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
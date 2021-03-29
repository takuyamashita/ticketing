import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from 'ticket-common/build';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concerts',
        price: 999,
        userId: mongoose.Types.ObjectId().toHexString(),
    };
    //@ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { message, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
    const { message, data, ticket, listener } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { message, data, ticket, listener } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { message, data, listener, ticket } = await setup();

    data.version = 10;

    try{
        await listener.onMessage(data, message);
    }catch(error){
        
    }

    expect(message.ack).not.toHaveBeenLastCalledWith();
})
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from 'ticket-common/build';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], message: Message){
        const ticket = await Ticket.findByEvent(data);

        if(!ticket){
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        await ticket.save();

        message.ack();
    }
}
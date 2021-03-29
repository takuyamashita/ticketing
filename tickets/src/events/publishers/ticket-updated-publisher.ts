import { Publisher, Subjects, TicketUpdatedEvent } from 'ticket-common/build';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

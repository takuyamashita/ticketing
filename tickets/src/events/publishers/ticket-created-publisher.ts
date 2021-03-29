import { Publisher, Subjects, TicketCreatedEvent } from 'ticket-common/build';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

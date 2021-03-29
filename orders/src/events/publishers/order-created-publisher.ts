import { Publisher, OrderCreatedEvent, Subjects } from 'ticket-common/build';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}


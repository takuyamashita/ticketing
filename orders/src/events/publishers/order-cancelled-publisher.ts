import { Subjects, Publisher, OrderCancelledEvent } from 'ticket-common/build';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
import { Subjects, Publisher, PaymentCreatedEvent } from 'ticket-common/build';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
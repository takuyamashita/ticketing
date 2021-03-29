import { Subjects, Publisher, ExpirationCompleteEvent } from 'ticket-common/build';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}
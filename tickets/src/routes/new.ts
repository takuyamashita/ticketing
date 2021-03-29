import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from 'ticket-common/build';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must  be greater than 0'),
    ], 
    validateRequest,
    async (request: Request, response: Response) => {
        const { title, price } = request.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: request.currentUser!.id,
        });

        await ticket.save();

        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        response.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
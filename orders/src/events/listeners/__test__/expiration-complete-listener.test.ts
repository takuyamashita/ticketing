import  mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { ExpirationCompleteEvent, OrderStatus } from 'ticket-common/build';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();
    
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'fjdka',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, order, ticket, data, message };
};

it('updates the order status to cancelld', async () => {
    const { listener, order, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const { listener, order, data, message } = await setup();
    
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});
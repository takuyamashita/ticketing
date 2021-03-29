import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderStatus } from 'ticket-common/build';
import { OrderCancelledEvent } from 'ticket-common/build';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        price: 10,
        userId: 'fdsakj',
        version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'fdajk',
        },
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, data, message };
};

it('updates the status of the order', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});
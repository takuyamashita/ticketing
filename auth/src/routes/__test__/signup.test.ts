import request from 'supertest';
import { app } from '../../app';

it('returs a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
});

it('return a 400 with as invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password',
        })
        .expect(400);
});

it('return a 400 with as invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'pd',
        })
        .expect(400);
});

it('return a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tescom'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'a'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
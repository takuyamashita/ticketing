import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/'),
    });

    const onSubmit = async (ev) => {
        ev.preventDefault();

        await doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    className="form-control"
                    onChange={ev => setEmail(ev.currentTarget.value)}
                />
            </div>
            <div className="form-group">
                <label>Paasword</label>
                <input
                    className="form-control" type="password"
                    onChange={ev => setPassword(ev.currentTarget.value)}
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </form>
    );
};

export default Signup;
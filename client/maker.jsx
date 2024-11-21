const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const job = e.target.querySelector('#domoJob').value;

    if(!name || !age || !job) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, job}, onDomoAdded);
    return false;
};

const handleChangePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }
    
    console.log(pass);

    //helper.sendPost(e.target.action, {pass, pass2});
    //return false;
}

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <label htmlFor='job'>Occupation: </label>
            <input id='domoJob' type='text' name='job' placeholder='Domo Occupation' />
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <img src="/assets/img/domoface.jpeg" alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoJob'>Occupation: {domo.job}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='makeDomo'>
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const PassChangeWindow = (props) => {
    return (
        <form id='passChangeForm'
            name='passChangeForm'
            obSubmit={handleChangePass}
            action='/changePass'
            method='POST'
            className='mainForm'
        >
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password' />
            <input className="formSubmit" type="submit" value="Change" />
        </form>
    );
};

const init = () => {
    const passChangeButton = document.getElementById('passChangeButton');
    const root = createRoot(document.getElementById('app'));

    passChangeButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <PassChangeWindow /> );
        return false;
    });

    root.render( <App /> );
};

window.onload = init;
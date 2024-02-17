const config = {
    serverProtocol: 'http',
    wsProtocol: 'ws',
    serverURL: '10.104.188.229:8000',
};

const getServerURL = () => {
    return `${config.serverProtocol}://${config.serverURL}`;
}

const getWsURL = () => {
    return `${config.wsProtocol}://${config.serverURL}`;
}

export default { 
    getServerURL,
    getWsURL
};
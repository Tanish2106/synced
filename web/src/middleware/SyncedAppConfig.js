const config = {
    serverProtocol: 'http',
    wsProtocol: 'ws',
    serverURL: '10.104.95.222:8000',
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
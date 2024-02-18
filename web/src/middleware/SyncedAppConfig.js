const config = {
    serverProtocol: 'http',
    wsProtocol: 'ws',
    serverURL: 'localhost:8000',
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
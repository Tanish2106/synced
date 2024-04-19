const config = {
    serverProtocol: 'http',
    wsProtocol: 'ws',
    serverURL: 'synced.atheesh.org:8000',
    isProd: true,
};

const getServerURL = () => {
    return (isProd) ? "" : `${config.serverProtocol}://${config.serverURL}`;
}

const getWsURL = () => {
    return (isProd) ? "" : `${config.wsProtocol}://${config.serverURL}`;
}

export default { 
    getServerURL,
    getWsURL
};
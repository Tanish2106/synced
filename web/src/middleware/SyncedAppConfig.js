const config = {
    serverProtocol: 'http',
    serverURL: '10.104.188.229:8000',
};

const getServerURL = () => {
    return `${config.serverProtocol}://${config.serverURL}`;
}

export default { 
    getServerURL
};
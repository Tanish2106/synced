const getRoomId = (pathname) => {
    /* Split Pathname to get RoomId */
    return pathname.split("/").pop();
}

export default { getRoomId }
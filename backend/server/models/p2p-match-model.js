'use strict';

module.exports = function(P2pmatchmodel) {
    /**
     * Endpoint de prueba para registrar / handshake P2P vía HTTP REST
     */
    P2pmatchmodel.initSession = function(peerData, cb) {
        const response = {
            message: 'Sesión P2P inicializada correctamente',
            peerId: peerData.peerId,
            status: 'ready',
            timestamp: new Date()
        };
        cb(null, response);
    };

    P2pmatchmodel.remoteMethod('initSession', {
        accepts: [
            { arg: 'peerData', type: 'object', http: { source: 'body' } }
        ],
        returns: { arg: 'result', type: 'object', root: true },
        http: { path: '/init-session', verb: 'post' }
    });
};
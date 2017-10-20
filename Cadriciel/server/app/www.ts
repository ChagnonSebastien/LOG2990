/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from './app';
import { ServerCrosswords } from './crosswordGrid/ServerCrosswords';
import * as http from 'http';
import { SocketManager } from './socket.service';
const db = require('./db-connection');

// start app after database is connected
db.connect()
    .then(() => console.log('database connected'))
    .then(() => {
        const application: Application = Application.bootstrap();

        // initilize server crossword with collection crosswords
        const serverCrosswords = ServerCrosswords.getInstance();
        serverCrosswords.setCollection('crosswords');
        serverCrosswords.initializeServerCrossword()
            .then(() => console.log('crosswords stored on server'))
            .then(() => {
                // Configuration du port d'écoute
                const appPort = normalizePort(process.env.PORT || '3000');
                application.app.set('port', appPort);

                // Création du serveur HTTP.
                const server = http.createServer(application.app);

                /**
                 *  Écoute du traffic sur le port configuré.
                 */
                server.listen(appPort);
                server.on('error', onError);
                server.on('listening', onListening);

                const socketManager = new SocketManager(server);
                socketManager.handleSockets();

                /**
                 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
                 *
                 * @param val Valeur du port d'écoute.
                 * @returns Le port normalisé.
                 */
                function normalizePort(val: number | string): number | string | boolean {
                    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
                    if (isNaN(port)) {
                        return val;
                    } else if (port >= 0) {
                        return port;
                    } else {
                        return false;
                    }
                }

                /**
                 * Se produit lorsque le serveur détecte une erreur.
                 *
                 * @param error Erreur interceptée par le serveur.
                 */
                function onError(error: NodeJS.ErrnoException): void {
                    if (error.syscall !== 'listen') { throw error; }
                    const bind = (typeof appPort === 'string') ? 'Pipe ' + appPort : 'Port ' + appPort;
                    switch (error.code) {
                        case 'EACCES':
                            console.error(`${bind} requires elevated privileges`);
                            process.exit(1);
                            break;
                        case 'EADDRINUSE':
                            console.error(`${bind} is already in use`);
                            process.exit(1);
                            break;
                        default:
                            throw error;
                    }
                }

                /**
                 * Se produit lorsque le serveur se met à écouter sur le port.
                 */
                function onListening(): void {
                    const addr = server.address();
                    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
                    console.log(`Listening on ${bind}`);
                }
            });
    });

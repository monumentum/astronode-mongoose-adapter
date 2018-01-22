module.exports = conn => {
    conn.on('error', err => {
        console.log('Mongoose default connection error: ' + err);
    });

    conn.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
    });

    process.on('SIGINT', () => {
        conn.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    return new Promise(resolve => conn.on('connected', () => {
        console.log('Mongoose default connection open to ' + this.uri);
        resolve();
    }));
}
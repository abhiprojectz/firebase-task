const app = require('./app');
async function main() {
    await app.listen(process.env.PORT || 5000);
    console.log('Server on port',process.env.PORT );
}

main();

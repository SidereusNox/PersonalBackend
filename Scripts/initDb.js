const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = 'mongodb://localhost:27017';
const collectionName = 'users';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    try {
        const password = await new Promise((resolve) => {
            rl.question('Enter password: ', resolve);
        });

        const user = {
            username: 'admin',
            passwordHash: await bcrypt.hash(password, 5)
        };
        
        await client.connect();

        const collection = client.db('personalWebsite').collection(collectionName);
        await collection.deleteMany({});
        await collection.insertOne(user);

        console.log('admin user inserted');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        rl.close();
    }
})();

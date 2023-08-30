const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

class UserRepository {

    uri = 'mongodb://localhost:27017';
    dbName = 'personalWebsite';
    collectionName = 'users';

    async connect() {
        this.client = new MongoClient(this.uri, { useNewUrlParser: true });
        await this.client.connect();
        this.collection = this.client.db(this.dbName).collection(this.collectionName);
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
        }
    }

    async getByUsername(username) {
        try {
            const user = await this.collection.findOne({ username });
            return user;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

class DevUserRepository {
    async getByUsername(username) {
        const password = 'admin';
        const passwordHash = await bcrypt.hash(password, 5)
        return { username: 'admin', passwordHash: passwordHash };
    }

    async connect(){
    }

    async disconnect(){
    }
}

module.exports = process.env.NODE_ENV === 'publish' ? UserRepository : DevUserRepository;

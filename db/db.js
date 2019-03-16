const {uri, dbName} = require('./config');

const MongoClient = require('mongodb').MongoClient;

// const client = new MongoClient(config.uri, { useNewUrlParser: true });

exports.checkConnection = async () => {
    const connection = await MongoClient.connect(uri, { useNewUrlParser: true });
    console.log('connected');

    connection.close();
};

exports.getUsers = async () => {
    let client = await MongoClient.connect(uri, {useNewUrlParser: true});

    console.log('connected successfully!');

    const currentDb = client.db(dbName);

    const usersCol = currentDb.collection('users');

    const users = await usersCol.find({}).toArray();

    client.close();

    return users;
};

exports.addUser = async (userId) => {
    let client = null;
    try {
        client = await MongoClient.connect(uri, {useNewUrlParser: true});

        const currentDb = client.db(dbName);

        const usersCol = currentDb.collection('users');
        console.log(await usersCol.find({userId}, {_id: 0, userId: 1}).toArray());
        const isNewUser = !((await usersCol.find({userId}).toArray()).length);

        if (isNewUser) {
            const addedUser = await usersCol.insertOne({userId});
            console.log('New user was added')
        } else {
            console.log('user already exists');
        }

    } catch (err) {
        console.log(err)
    }
    client.close();
};
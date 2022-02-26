const db_username = _getEnv("DB_USERNAME");
const db_password = _getEnv("DB_PASSWORD");
const db_name = _getEnv("DB_DATABASE");

print('');
print('');
print('---> CONNECTING USER, DATABASE AND ROLES <---');
db.createUser({
    user: db_username,
    pwd: db_password,
    roles: [
      {
        role: 'dbOwner',
        db: db_name,
      },
    ],
  });

print('');
print('---> CONNECTING TO DATABASE ' + db_name + ' <---');
db = db.getSiblingDB(db_name);

print('');
print('---> CREATING COLLECTIONS <---');
const collection_name = 'urls';
db.createCollection(collection_name);
print('---> CREATED COLLECTION: ' + collection_name + ' <---');


print('');
print('---> CREATING INDEXS <---');
db.urls.createIndex({ shortened: 1 }, { unique: true });
print('---> CREATED INDEX FOR COLLECTION ' + collection_name + ' <---');

print('');
print('---> INSERING RECORDS <---');
db.urls.insertMany([
     {
        original: "http://www.dba-oracle.com/t_calling_oracle_function.htm",
        shortened: "EEZj6VE0b",
        createdAt: "1644279514605"
    }
   ]);

print('');
print('---> SUCCESS TO RUN SCRIPT <---');
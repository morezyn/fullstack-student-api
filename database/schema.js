module.exports = {
  studentsValidator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['first_name', 'last_name', 'email', 'created_at', 'updated_at'],
      properties: {
        first_name: { bsonType: 'string' },
        last_name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        date_of_birth: { bsonType: ['string', 'null'] },
        major: { bsonType: ['string', 'null'] },
        enrollment_year: { bsonType: ['int', 'null'] },
        created_at: { bsonType: 'string' },
        updated_at: { bsonType: 'string' },
      },
    },
  },
};

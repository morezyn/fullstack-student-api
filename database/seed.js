const timestamp = () => new Date().toISOString();

const students = [
  {
    _id: 101,
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada.lovelace@example.com',
    date_of_birth: '1815-12-10',
    major: 'Mathematics',
    enrollment_year: 2022,
    created_at: timestamp(),
    updated_at: timestamp(),
  },
  {
    _id: 102,
    first_name: 'Alan',
    last_name: 'Turing',
    email: 'alan.turing@example.com',
    date_of_birth: '1912-06-23',
    major: 'Computer Science',
    enrollment_year: 2022,
    created_at: timestamp(),
    updated_at: timestamp(),
  },
  {
    _id: 103,
    first_name: 'Grace',
    last_name: 'Hopper',
    email: 'grace.hopper@example.com',
    date_of_birth: '1906-12-09',
    major: 'Computer Science',
    enrollment_year: 2023,
    created_at: timestamp(),
    updated_at: timestamp(),
  },
];

module.exports = { students, nextStudentId: 103 };

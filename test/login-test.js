const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app.js');



//test case for login
describe('Testing whether user is able to login without given email and passowrd after register', () => {
    it('Returns a 401 response', (done) => {
        chai.request(app)
            .post('http://localhost:3000/api/auth/login')
			.send({
				'password': '',
				'name': ''
			  })
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(401);
                done();
            });
    });
});

//test case for register
describe('Testing whether user is able to register without role', () => {
    it('Returns a 503 response', (done) => {
        chai.request(app)
            .post('/api/auth/register')
			.send({
				'email': 'msd495@gmail.com',
				'password': 'ayush123',
				'name': 'ayush',
				'role':''
			  })
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(503);
                done();
            });
    });
});

//test case for finding all books without authentication token
describe('test case for finding all books without authentication token', () => {
    it('Returns a 401 response', (done) => {
        chai.request(app)
            .get('/api/auth/findAllBooks')
			.send({
				'x-access-token': ''
			  })
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(401);
                done();
            });
    });
});

//test case for seraching seraching book which is not there
describe('test case for seraching book which is not there', () => {
    it('Returns a 404 response', (done) => {
        chai.request(app)
            .get('/api/books/getBook/hindi')
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(404);
                done();
            });
    });
});

//test case for adding the book if the role is not editor
describe('Hello World Route', () => {
    it('Returns a 200 response', (done) => {
        chai.request(app)
            .post('/api/books/insertBookInformationFromEditor')
			.query({author: 'ayush', isbn: "6772",genre:"love"})
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(401);
                done();
            });
    });
});

//test case for adding the book if the role is editor
describe('test case for adding the book if the role is editor', () => {
    it('Returns a 403 response', (done) => {
        chai.request(app)
            .post('/api/books/insertBookInformationFromEditor')
			.query({author: 'ayush', isbn: "6772",genre:"love",title:"harry potter"})
            .end((error, response) => {
                if (error) done(error);
                // Now let's check our response
                expect(response).to.have.status(200);
                done();
            });
    });
});


//database testing 
describe('book', () => {
    describe('Create Book', () => {
        it('Returns a 404 response', () => {
            return chai.request(app)
                .post('/book')
                .send({
                    name: 'John Doe',
                    phone: '1-800 999',
                    email: 'johndoe@example.com',
                    dogs: 2
                })
                .then(response => {
                    // Now let's check our response
                    expect(response).to.have.status(200);
                    done();
                })
        });
    });
});

//to check actually the record has gone or not

it('Creates a book document in our DB', () => {
    return chai.request(app)
        .post('/book')
        .send({
            name: 'John Doe',
            phone: '1-800 999',
            email: 'johndoe@example.com',
            dogs: 2
        })
        .then(() => {
            return book.find({
                email: 'johndoe@example.com'
            });
        })
        .then(result => {
            expect(result).to.have.lengthOf(1);

            const book = result[0];
            expect(book.name).to.be.equal('John Doe');
            expect(book.phone).to.be.equal('1-800 999');
            expect(book.dogs).to.be.equal(2);
            done();
        })
});



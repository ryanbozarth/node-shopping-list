var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on post', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/0')
            .send({'name': 'Green beans'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.name.should.be.equal('Green beans');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/0')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    it('should not post to an ID that does not exist');
    it('should not post without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send({})
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.not.have.property('name');
                done();
            });
    });
    it('should not put without an endpoint');
    it('should not put with different ID in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/items/0')
            .send({'name': 'coffee', 'id': 4})
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('should not put an id that does not exist', function(done) {
        chai.request(app)
            .put('/items')
            .send({'name': 'coffee', 'id': 4})
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });
    it('should not put without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send({})
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.not.have.property('name');
            });
    });
    it('should not put with something other than json', function(done) {
        chai.request(app)
            .put('/items')
            .end(function(err, res) {
                res.should.be.json;
            });
    });
    it('should not delete an ID that does not exist', function(done) {
        chai.request(app)
            .delete('/items/6')
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
    });
    it('should not delete without an ID in the endpoint', function(done) {
        chai.request(app)
            .delete('/items/')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
});

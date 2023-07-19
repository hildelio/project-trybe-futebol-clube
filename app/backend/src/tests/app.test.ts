import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Response } from 'superagent';
import TeamsModel from '../models/TeamsModel';
import teamsMock from './mocks/teamsMock';
import teamMock from './mocks/teamMock';
import LoginModel from '../models/LoginModel';
import httpStatus from '../utils/httpStatus';
import MatchesModel from '../models/MatchesModel';
import AllMatchesMock from './mocks/allMatchesMock';
import loginMock from './mocks/loginMock';
import userMock from './mocks/userMock';
import tokenMock from './mocks/tokenMock';

chai.use(chaiHttp);

const { expect } = chai;

const { app, start } = new App();

describe('Class App', () => {
  afterEach(() => {
    sinon.restore();
  })

  const req = { body: {}};
  const res = {};

  it('Verifica se existe a classe App', () => {
    expect(app).to.be.ok;
  });

  it('Verifica se existe o método start', () => {
    expect(start).to.be.ok;
  })

  it('Verifica se ao acessar a rota /teams deve retornar 404 em caso de erro', async function() {
    sinon.stub(TeamsModel.prototype, 'findAll').resolves(undefined);

    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.be.equal(httpStatus.notFound);
    expect(body).to.be.deep.equal({message: 'Teams not founded'});
  })

  it('Verifica se acessa a rota /teams com sucesso', async function() {

    sinon.stub(TeamsModel.prototype, 'findAll').resolves(teamsMock);

    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(teamsMock);
  })
  
  it('Verifica se ao acessar a rota /teams/:id deve retornar 404 em caso de erro', async function() {
    sinon.stub(TeamsModel.prototype, 'findById').resolves(null);

    const {status, body} = await chai.request(app).get('/teams/9999');
    expect(status).to.be.equal(httpStatus.notFound);
    expect(body).to.be.deep.equal({message: 'Team not founded'});
  })
  
  it('Verifica se acessa a rota /teams/:id com sucesso', async function() {

    sinon.stub(TeamsModel.prototype, 'findById').resolves(teamMock);

    const {status, body} = await chai.request(app).get('/teams/12');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(teamMock);
  })

  it.skip('Verifica se ao acessar a rota /login com email inválido retorna erro 401', async function() {

    sinon.stub(LoginModel.prototype, 'findOne').resolves(null);

    const {status, body} = await chai.request(app).get('/login');
    expect(status).to.be.equal(httpStatus.unauthorized);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password'});
  })
  it.skip('Verifica se acessa a rota /login com sucesso', async function() {
    req.body = loginMock;
    sinon.stub(LoginModel.prototype, 'findOne').resolves(userMock);

    const {status, body} = await chai.request(app).post('/login');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(tokenMock);
  })

  it('Verifica se acessa a rota /matches com sucesso', async function() {
    sinon.stub(MatchesModel.prototype, 'findAll').resolves(AllMatchesMock);

    const {status, body} = await chai.request(app).get('/matches');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(AllMatchesMock);
  })
});

import * as sinon from 'sinon';
import * as chai from 'chai';
// import * as chaiSpies from 'chai-spies';

import * as bcrypt from 'bcryptjs';

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
import { InvalidEmail, adminLogin, adminLoginBCrypt, invalidPassword } from './mocks/loginMock';
import userMock from './mocks/userMock';
import tokenMock from './mocks/tokenMock';
import matchesInProgressTrueMock from './mocks/matchesInProgressTrueMock';
import matchesInProgressFalseMock from './mocks/matchesInProgressTrueMock copy';
import MatchMock from './mocks/matchMock';
import SequelizeMatch from '../database/models/MatchModel';
import SequelizeMatchExtended from '../Interfaces/leaderboard/SequelizeMatchExtended';
import matchRequestUpdateMock from './mocks/matchRequestUpdateMock';
import matchUpdatedMock from './mocks/matchUpdatedMock';

chai.use(chaiHttp);
// chai.use(chaiSpies);

const { expect } = chai;

const { app, start } = new App();

describe('Class App', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('Verifica se existe a classe App', () => {
    expect(app).to.be.ok;
  });

  it('Verifica se existe o método start', () => {
    expect(start).to.be.ok;
  })

  // it.skip('Verifica se o método start configura a porta corretamente', () => {
  //   const app = new App();
  //   const PORT = 3001;

  //   chai-spyOn(console, 'log');

  //   app.start(PORT);
    
    
  //   expect(app['app'].listen).to.have.been.called.with(PORT);
  // });
  

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

  it('Verifica se ao acessar a rota /login com email inválido retorna erro 401', async function() {

    sinon.stub(LoginModel.prototype, 'findOne').resolves(null);

    const {status, body} = await chai.request(app).post('/login').send(InvalidEmail);
    expect(status).to.be.equal(httpStatus.unauthorized);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password'});
  })

  it('Verifica se ao acessar a rota /login com senha inválida retorna erro 401', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(false);
    sinon.stub(LoginModel.prototype, 'findOne').resolves(userMock);

    const {status, body} = await chai.request(app).post('/login').send(invalidPassword);
    expect(status).to.be.equal(httpStatus.unauthorized);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password'});
  })

  it('Verifica se acessa a rota /login com sucesso', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(LoginModel.prototype, 'findOne').resolves(userMock);

    const {status, body} = await chai.request(app).post('/login').send(adminLogin);
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.haveOwnProperty('token');
  })

  it('Verifica se acessa a rota /login/role com sucesso', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(LoginModel.prototype, 'findOne').resolves(userMock);

    const token = await chai.request(app).post('/login').send(adminLogin);

    const {status, body} = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', 'Bearer ' + token.body.token);
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal({ role: 'admin' });
  })

  it('Verifica se ao acessa a rota /matches recebe "Matches not found"', async function() {
    sinon.stub(MatchesModel.prototype, 'findAll').resolves(undefined);

    const {status, body} = await chai.request(app).get('/matches');
    expect(status).to.be.equal(httpStatus.notFound);
    expect(body).to.be.deep.equal({ message: 'Matches not found' });
  })

  it('Verifica se acessa a rota /matches com sucesso', async function() {
    sinon.stub(MatchesModel.prototype, 'findAll').resolves(AllMatchesMock);

    const {status, body} = await chai.request(app).get('/matches');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(AllMatchesMock);
  })

  it('Verifica se acessa a rota /matches/inProgress=true com sucesso', async function() {
    sinon.stub(MatchesModel.prototype, 'findAll').resolves(matchesInProgressTrueMock);

    const {status, body} = await chai.request(app).get('/matches/?inProgress=true');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(matchesInProgressTrueMock);
  })

  it('Verifica se acessa a rota /matches/inProgress=false com sucesso', async function() {
    sinon.stub(MatchesModel.prototype, 'findAll').resolves(matchesInProgressFalseMock);

    const {status, body} = await chai.request(app).get('/matches/?inProgress=false');
    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(matchesInProgressFalseMock);
  })

  it('Verifica se ao acessar a rota /matches/:id/finish recebe  "Match not found', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const matchToUpdate: SequelizeMatch = new SequelizeMatch();    

    matchToUpdate.id = 1;
    matchToUpdate.homeTeamId = 16;
    matchToUpdate.awayTeamId = 8;
    
    sinon.stub(MatchesModel.prototype, 'findById').resolves(null);
    matchToUpdate.inProgress = false;
    
    sinon.stub(matchToUpdate, 'save').resolves(matchUpdatedMock as SequelizeMatch)
    
    const tokenResponse = await chai.request(app).post('/login').send(adminLogin);

    const token = tokenResponse.body.token;

    const {status, body} = await chai
      .request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'Bearer ' + token)

      expect(status).to.be.equal(httpStatus.notFound);
      expect(body).to.be.deep.equal({ message: 'Match not found'});
  })

  it('Verifica se acessa a rota /matches/:id/finish com sucesso', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const matchToUpdate: SequelizeMatch = new SequelizeMatch();    

    matchToUpdate.id = 1;
    matchToUpdate.homeTeamId = 16;
    matchToUpdate.awayTeamId = 8;
    
    sinon.stub(MatchesModel.prototype, 'findById').resolves(matchToUpdate);
    matchToUpdate.inProgress = false;
    
    sinon.stub(matchToUpdate, 'save').resolves(matchUpdatedMock as SequelizeMatch)
    
    const tokenResponse = await chai.request(app).post('/login').send(adminLogin);

    const token = tokenResponse.body.token;

    const {status, body} = await chai
      .request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'Bearer ' + token)

      expect(status).to.be.equal(httpStatus.ok);
      expect(body).to.be.deep.equal('Finished');
  })

  it('Verifica se ao acessar a rota /matches/:id recebe "Match not found"', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const matchToUpdate: SequelizeMatch = new SequelizeMatch();    

    matchToUpdate.id = 1;
    matchToUpdate.homeTeamId = 16;
    matchToUpdate.awayTeamId = 8;
    
    sinon.stub(MatchesModel.prototype, 'findById').resolves(null);
    matchToUpdate.inProgress = false;
    
    sinon.stub(matchToUpdate, 'save').resolves(matchUpdatedMock as SequelizeMatch)
    
    const tokenResponse = await chai.request(app).post('/login').send(adminLogin);

    const token = tokenResponse.body.token;

    const {status, body} = await chai
      .request(app)
      .patch('/matches/1')
      .set('Authorization', 'Bearer ' + token)
      .send(matchRequestUpdateMock)

      expect(status).to.be.equal(httpStatus.notFound);
      expect(body).to.be.deep.equal({ message: 'Match not found'});
  })

  it('Verifica se acessa a rota /matches/:id com sucesso', async function() {
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const matchToUpdate: SequelizeMatch = new SequelizeMatch();    

    matchToUpdate.id = 1;
    matchToUpdate.homeTeamId = 16;
    matchToUpdate.awayTeamId = 8;
    
    sinon.stub(MatchesModel.prototype, 'findById').resolves(matchToUpdate);
    matchToUpdate.inProgress = false;
    
    sinon.stub(matchToUpdate, 'save').resolves(matchUpdatedMock as SequelizeMatch)
    
    const tokenResponse = await chai.request(app).post('/login').send(adminLogin);

    const token = tokenResponse.body.token;

    const {status, body} = await chai
      .request(app)
      .patch('/matches/1')
      .set('Authorization', 'Bearer ' + token)
      .send(matchRequestUpdateMock)

      expect(status).to.be.equal(httpStatus.ok);
      expect(body).to.be.deep.equal(matchUpdatedMock);
  })

  it.only('Verifica se acessa a rota /leaderboard/home com sucesso', async function() {
    const {status, body} = await chai.request(app).get('/leaderboard/home');

    expect(status).to.be.equal(httpStatus.ok);
    expect(body).to.be.deep.equal(MatchMock);
  })
});

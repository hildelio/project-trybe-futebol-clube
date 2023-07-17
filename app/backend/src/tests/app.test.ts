import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Response } from 'superagent';
import TeamsModel from '../models/TeamsModel';
import teamsMock from './mocks/teamsMock';
import teamsRouter from '../routes/teamsRouter';
import teamMock from './mocks/teamMock';

chai.use(chaiHttp);

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

  it('Verifica se ao acessar a rota /teams deve retornar 404 em caso de erro', async function() {
    sinon.stub(TeamsModel.prototype, 'findAll').resolves(undefined);

    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.be.equal(404);
    expect(body).to.be.deep.equal({message: 'Teams not founded'});
  })

  it('Verifica se acessa a rota /teams com sucesso', async function() {

    sinon.stub(TeamsModel.prototype, 'findAll').resolves(teamsMock);

    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(teamsMock);
  })
  
  it('Verifica se ao acessar a rota /teams/:id deve retornar 404 em caso de erro', async function() {
    sinon.stub(TeamsModel.prototype, 'findById').resolves(null);

    const {status, body} = await chai.request(app).get('/teams/9999');
    expect(status).to.be.equal(404);
    expect(body).to.be.deep.equal({message: 'Team not founded'});
  })
  
  it('Verifica se acessa a rota /teams/:id com sucesso', async function() {

    sinon.stub(TeamsModel.prototype, 'findById').resolves(teamMock);

    const {status, body} = await chai.request(app).get('/teams/12');
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(teamMock);
  })
});

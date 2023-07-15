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
  beforeEach(() => {
    sinon.restore();
  })

  it('Verifica se existe a classe App', () => {
    expect(app).to.be.ok;
  });

  it('Verifica se existe o método start', () => {
    expect(start).to.be.ok;
  })

  it('Verifica se acessa a rota /teams com sucesso', async function() {
    const teamsModelInstance = new TeamsModel();

    sinon.stub(teamsModelInstance, 'findAll').resolves(teamsMock);

    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(teamsMock);
  })

  it('Verifica se acessa a rota /teams/:id com sucesso', async function() {
    const teamsModelInstance = new TeamsModel();

    sinon.stub(teamsModelInstance, 'findById').resolves(teamMock);

    const {status, body} = await chai.request(app).get('/teams/12');
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(teamMock);
  })
});
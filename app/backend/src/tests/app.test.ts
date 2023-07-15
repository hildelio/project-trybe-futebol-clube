import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Response } from 'superagent';

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
});

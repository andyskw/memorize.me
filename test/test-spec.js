var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe("Test setup test", () => {
    it('should return true', () => {
        expect(true).to.be.true;
    });
});
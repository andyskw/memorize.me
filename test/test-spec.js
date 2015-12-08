var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe("App starter", () => {
    it('should return true', () => {
        expect(true).to.be.true;
    });
});
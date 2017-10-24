"use strict";
import InsightFacade from "../src/controller/InsightFacade";
var chai_1 = require("chai");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require("fs");
describe("testAddData", function () {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
    });
    beforeEach(function () {
        insightF = new InsightFacade_1.default();
    });
    after(function () {
        insightF.removeDataset('courses');
    });
    afterEach(function () {
        insightF.removeDataset('courses');
    });
    it("Import invalid2.zip ，do not store the data of invalid2", function (done) {
        var data = fs.readFileSync(__dirname + '/data/invalid2.zip', "base64");
        insightF.addDataset("invalid2", data).then(function (value) {
            chai_1.expect.fail();
            done();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync('./src/controller/invalid2');
            chai_1.expect(ifFileExist).to.be.false;
            done();
        });
    });
    it("Import emptyFolder2.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/emptyFolder2.zip', "base64");
        return insightF.addDataset("emptyFolder2", data).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/emptyFolder2');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import biginvalid.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/bigInValid.zip', "base64");
        return insightF.addDataset("biginvalid", data).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/biginvalid');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import invalid.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");
        return insightF.addDataset("invalid", data).then(function (value) {
            var a = value;
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import figure1.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/figure1.zip', "base64");
        return insightF.addDataset("figure1", data).then(function (value) {
            var a = value;
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/datat.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import figure1, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/figure1.png', "base64");
        return insightF.addDataset("figure1", data).then(function (value) {
            var a = value;
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Given an invalid string and return 400", function () {
        return insightF.addDataset("Empty", "A").then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import invalid.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");
        return insightF.addDataset("Empty", data).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import invalid2.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/invalid2.zip', "base64");
        return insightF.addDataset("invalid2", data).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("Import empty.zip, it should return code 400", function () {
        var data = fs.readFileSync(__dirname + '/data/emptyFolder.zip', "base64");
        return insightF.addDataset("Empty", data).then(function (value) {
            chai_1.expect.fail();
        }).catch(function (err) {
            var a = err;
            chai_1.expect(a.code).to.deep.equal(400);
            var ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            chai_1.expect(ifFileExist).to.be.false;
        });
    });
    it("simple test for addDataset with courses.zip", function () {
        var data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        insightF.removeDataset('courses');
        return insightF.addDataset('courses', data).then(function (value) {
            var a = value;
            chai_1.expect(a.code).to.deep.equal(204);
            var m = fs.existsSync('./test/data/courses.txt');
            chai_1.expect(m).to.be.true;
            var dataID = insightF.getDataController().getDataInMemory().has("courses");
            chai_1.expect(dataID).to.be.true;
            var dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
            chai_1.expect(dataSize).to.equal(64612);
        }).catch(function (err) {
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=AddDatasetTest.js.map
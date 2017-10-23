import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testRemoveData", function() {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        insightF = new InsightFacade();
        let data =fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        insightF.addDataset('courses', data);
    });

    beforeEach(function () {
        //Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function() {
        insightF.removeDataset('courses');
    })

    afterEach(function () {
        insightF.removeDataset('courses');
    });

    it("simple test for addDataset with courses.zip", function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        insightF.removeDataset('courses');

        return insightF.addDataset("courses", data).then(function (value: InsightResponse) {

            let a = value;
            expect(a.code).to.deep.equal(204);
            let m = fs.existsSync('./src/controller/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getDataController().getDataInMemory().has("courses");
            expect(dataID).to.be.true;
            let dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
            expect(dataSize).to.equal(64612)
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });

    });


/*    it("Import course.zip ，store the data and remove successfully", function () {
        let ifFileExist = fs.existsSync('./src/controller/courses.txt');
        expect(ifFileExist).to.deep.equal(true);
       return insightF.removeDataset("courses").then(function (value: InsightResponse) {
            let m = value;
            expect(m.code).to.deep.equal(204);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;

        }).catch(function () {
            expect.fail();

        });

    });*/


    it("Test remove when not in memory and file does not exist", function () {

        if(fs.existsSync('./src/controller/courses.txt')){
            fs.unlinkSync('./src/controller/courses.txt');
        }

        return insightF.removeDataset("valid").then(function (value: InsightResponse) {
            expect.fail();
        }).catch(function (value: InsightResponse) {
            let m = value;
            expect(m.code).to.deep.equal(404);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;
        });

    });


})
import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testLoadData", function() {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        insightF = new InsightFacade();
        insightF.removeDataset('courses');
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    after(function() {
        //insightF.removeDataset('courses');
    })
//Not in memory

    it("Import course.zip and store the data, it should return code 204", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            let a = value;
            expect(a.code).to.deep.equal(204);
            let dataID = insightF.getDataController().getDataInMemory().has("courses");
            expect(dataID).to.be.true;
            let dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
            expect(dataSize).to.equal(64612)
        }).catch(function (err) {
            expect.fail();
        });
    });


})
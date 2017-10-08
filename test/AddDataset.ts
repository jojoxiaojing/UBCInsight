
import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testAddData", function() {
    this.timeout(1000000);
    var insightF: InsightFacade;
    before(function () {
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        //Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();
    });

    after(function () {
        //Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        //Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Import course.zip and store the data, it should return code 204", function (done) {


        fs.readFile(__dirname + '/data/courses.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Courses", data).then(function (value: any) {
                let a = value;
                expect(a.code).to.deep.equal(204);
                var testQuery = {"WHERE": {GT: {courses_audit: 10}}, "OPTIONS": {"COLUMNS": ["courses_avg"]}}
                insightF.performQuery(testQuery).then(function (value: any) {
                    let a = value;
                    done()
                }).catch(function (err) {
                    //log.error("Error: " + err);
                    expect.fail();
                    done()
                });
            });
        });
    });


    it("Import empty.zip and store the data, it should return code 400", function () {
        var that = this;
        return insightF.addDataset('courses', 'blah blah blah').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            //console.log(response.code)
            expect(response.code).to.equal(400);
        });
    });

})
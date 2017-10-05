
import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
var fs = require("fs");


describe("testAddData", function() {
    this.timeout(1000000);
    var insightF: InsightFacade;
    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Import course.zip and store the data, it should return code 204", function (done) {


        fs.readFile(__dirname + '/data/courses.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Courses", data).then(function (value: any) {
                let a = value;
                expect(a.code).to.deep.equal(204);
                var testQuery = {"WHERE": {GT: {courses_audit: 10}}}
                insightF.performQuery(testQuery).then(function (value: any) {
                    let a = value;
                    done();
                }).catch(function (err) {
                    log.error("Error: " + err);
                    expect.fail();
                    done()
                });
            });
        });


    });
})

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

    it("Import course.zip ，store the data and remove successfully", function (done) {

        fs.readFile(__dirname + '/data/courses.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Courses", data).then(function (value: InsightResponse) {
                let a = value;
                expect(a.code).to.deep.equal(204);
<<<<<<< HEAD
                let m = fs.existsSync('./src/controller/data.txt');
                expect(m).to.deep.equal(true);
                let dataID = insightF.getValue().id;
                expect(dataID).to.deep.equal("Courses");
                insightF.removeDataset("Courses").then(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(204);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.deep.equal(false);
=======
                var testQuery = {"WHERE": {GT: {courses_audit: 10}}, "OPTIONS": {"COLUMNS": ["courses_avg"]}}
                insightF.performQuery(testQuery).then(function (value: any) {
                    let a = value;
>>>>>>> 880c8eff2d10636074af8e86254eb6ea3f550714
                    done()
                }).catch(function (value: InsightResponse) {
                    expect.fail();
                    done()
                });

            }).catch(function (err: InsightResponse) {

            });
        });
    });

<<<<<<< HEAD
    it("Import course.zip ，store the data and remove unsuccessfully", function (done) {

        fs.readFile(__dirname + '/data/courses.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Courses", data).then(function (value: InsightResponse) {
                let a = value;
                expect(a.code).to.deep.equal(204);
                let m = fs.existsSync('./src/controller/data.txt');
                expect(m).to.deep.equal(true);
                let dataID = insightF.getValue().id;
                expect(dataID).to.deep.equal("Courses");
                insightF.removeDataset("Empty").then(function (value: InsightResponse) {
                    expect.fail();
                    done()
                }).catch(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(404);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.deep.equal(true);
                    done()
                });
            }).catch(function (err: InsightResponse) {
            });
        });
    });

    it("Import empty.zip, it should return code 400", function (done) {
        fs.readFile(__dirname + '/data/emptyFolder.zip', "base64", function (err: any, data: string) {
=======

    it("Import empty.zip and store the data, it should return code 400", function () {
        var that = this;
        return insightF.addDataset('courses', 'blah blah blah').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            //console.log(response.code)
            expect(response.code).to.equal(400);
        });
    });
>>>>>>> 880c8eff2d10636074af8e86254eb6ea3f550714

            insightF.addDataset("Empty", data).then(function (value: InsightResponse) {

                expect.fail();
                done()
            }).catch(function (err: InsightResponse) {
                let a = err;
                expect(a.code).to.deep.equal(400);
                let ifFileExist = fs.existsSync('./src/controller/data.txt');
                expect(ifFileExist).to.deep.equal(false);
                done()
            });
        });
    });

    it("Import empty.zip, it should return code 400", function (done) {
        fs.readFile(__dirname + '/data/emptyFolder.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Empty", data).then(function (value: InsightResponse) {

                expect.fail();
                done()
            }).catch(function (err: InsightResponse) {
                let a = err;
                expect(a.code).to.deep.equal(400);
                let ifFileExist = fs.existsSync('./src/controller/data.txt');
                expect(ifFileExist).to.deep.equal(false);
                done()
            });
        });
    });

    it("Given an invalid string and return 400", function (done) {

        insightF.addDataset("Empty", "A").then(function (value: InsightResponse) {

            expect.fail();
            done()
        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/data.txt');
            expect(ifFileExist).to.deep.equal(false);
            done()
        });
    });
})

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


    /*it("Import course.zip ，store the data and remove successfully", function (done) {

        fs.readFile(__dirname + '/data/courses.zip', "base64", function (err: any, data: string) {

            insightF.addDataset("Courses", data).then(function (value: InsightResponse) {
                let a = value;
                expect(a.code).to.deep.equal(204);

                let m = fs.existsSync('./src/controller/data.txt');
                expect(m).to.deep.equal(true);
                let dataID = insightF.getValue().id;
                expect(dataID).to.deep.equal("Courses");
                insightF.removeDataset("Courses").then(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(204);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.deep.equal(false);

                    done();
                }).catch(function (value: InsightResponse) {
                    //expect.fail();
                    done();
                });

            }).catch(function (err: InsightResponse) {

            });
        });
    });


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
                    done();
                }).catch(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(404);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.deep.equal(true);
                    insightF.removeDataset("Courses").then(function (value:InsightResponse) {
                        done();
                    });
                });
            }).catch(function (err: InsightResponse) {
                //expect.fail();
                done();
            });
        });
    });*/

    it("Import empty.zip, it should return code 400", function () {
        fs.readFile(__dirname + '/data/emptyFolder.zip', "base64", function (err: any, data: string) {

            if(err){
                console.log(err);
            }
            insightF.addDataset("Empty", data).then(function (value: InsightResponse) {
                expect.fail();
                // done();
            }).catch(function (err: InsightResponse) {
                let a = err;
                expect(a.code).to.deep.equal(400);
                let ifFileExist = fs.existsSync('./src/controller/data.txt');
                expect(ifFileExist).to.deep.equal(false);
                // done();
            });
        });
    });



/*
    it("Given an invalid string and return 400", function (done) {

        insightF.addDataset("Empty", "A").then(function (value: InsightResponse) {

            expect.fail();
            done();
        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/data.txt');
            expect(ifFileExist).to.deep.equal(false);
            done();
        });
    });*/
})

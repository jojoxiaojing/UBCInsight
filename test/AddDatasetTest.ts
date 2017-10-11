import {expect} from 'chai';
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

                let m = fs.existsSync('./src/controller/data.txt');
                expect(m).to.deep.equal(true);
                let dataID = insightF.getValue().id;
                expect(dataID).to.deep.equal("Courses");
                insightF.removeDataset("Courses").then(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(204);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.be.false;

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
                expect(m).to.be.true;
                let dataID = insightF.getValue().id;
                expect(dataID).to.deep.equal("Courses");
                insightF.removeDataset("Empty").then(function (value: InsightResponse) {
                    expect.fail();
                    done();
                }).catch(function (value: InsightResponse) {
                    let m = value;
                    expect(m.code).to.deep.equal(404);
                    let ifFileExist = fs.existsSync('./src/controller/data.txt');
                    expect(ifFileExist).to.be.true;
                    insightF.removeDataset("Courses").then(function (value:InsightResponse) {
                        let ifFileExist = fs.existsSync('./src/controller/data.txt');
                        expect(ifFileExist).to.be.false;
                        done();
                    });
                });
            }).catch(function (err: InsightResponse) {
                //expect.fail();
                done();
            });
        });
    });


    it("Run this test and remove data.text", function () {
        if(fs.existsSync('./src/controller/data.txt')){
            fs.unlink('./src/controller/data.txt');
        }
    });



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
                expect(ifFileExist).to.be.false;
                // done();
            });
        });
    });


   //
   //
   // it("Import invalid.zip, it should return code 400", function (done) {
   //     console.log("text begin");
   //      fs.readFile(__dirname + '/data/invalid.zip', "base64", function (err: any, data: string) {
   //
   //          insightF.addDataset("Invalid", data).then(function (value: InsightResponse) {
   //              let m = value;
   //              console.log("add data set begin");
   //
   //              let ifFileExist = fs.existsSync('./src/controller/data.txt');
   //              expect(ifFileExist).to.be.true;
   //              expect.fail();
   //              done();
   //          }).catch(function (err: any) {
   //              console.log("check error");
   //
   //              let a = err;
   //              if(err.message === "expect.fail()"){
   //                  expect.fail();
   //                  done();
   //              }
   //              expect(a.code).to.deep.equal(400);
   //              let ifFileExist = fs.existsSync('./src/controller/data.txt');
   //              expect(ifFileExist).to.be.false;
   //              done();
   //          });
   //       });
   //  });






   it("Given an invalid string and return 400", function (done) {

        insightF.addDataset("Empty", "A").then(function (value: InsightResponse) {

            expect.fail();
            // done();
        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/data.txt');
            expect(ifFileExist).to.be.false;
            // done();
        });
    });
})
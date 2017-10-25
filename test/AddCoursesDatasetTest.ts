import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testAddCoursesData", function() {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        //Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();
    });

    after(function() {
        //insightF.removeDataset('courses');
    })

    afterEach(function () {
        insightF.removeDataset('courses');
    });



    it("Import invalid2.zip ，do not store the data of invalid2", function (done) {


        let data = fs.readFileSync(__dirname + '/data/invalid2.zip', "base64");
        insightF.addDataset("invalid2", data).then(function (value: InsightResponse) {
            expect.fail();
            done();
        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/invalid2');
            expect(ifFileExist).to.be.false;
            done();
        });

    });


    it("Import emptyFolder2.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/emptyFolder2.zip', "base64");


        return insightF.addDataset("emptyFolder2", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/emptyFolder2');
            expect(ifFileExist).to.be.false;
        });

    });



    it("Import biginvalid.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/bigInValid.zip', "base64");


        return insightF.addDataset("biginvalid", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/biginvalid');
            expect(ifFileExist).to.be.false;
        });

    });



    it("Import invalid.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");


        return insightF.addDataset("invalid", data).then(function (value: any) {
            let a = value;
            expect.fail();

        }).catch(function (err: any) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;

        });
    });

    it("Import figure1.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/figure1.zip', "base64");


        return insightF.addDataset("figure1", data).then(function (value: any) {
            let a = value;
            expect.fail();

        }).catch(function (err: any) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/datat.txt');
            expect(ifFileExist).to.be.false;

        });
    });

    it("Import figure1, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/figure1.png', "base64");


        return insightF.addDataset("figure1", data).then(function (value: any) {
            let a = value;
            expect.fail();

        }).catch(function (err: any) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;

        });
    });

    it("Given an invalid string and return 400", function () {

        return insightF.addDataset("Empty", "A").then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;

        });
    });



    it("Import invalid.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");


        return insightF.addDataset("Empty", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;
        });

    });


    it("Import invalid2.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/invalid2.zip', "base64");


        return insightF.addDataset("invalid2", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;
        });

    });

    it("Import empty.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/emptyFolder.zip', "base64");


        return insightF.addDataset("Empty", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync(__dirname + '/courses.txt');
            expect(ifFileExist).to.be.false;
        });

    });


    it("simple test for addDataset with courses.zip", function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        insightF.removeDataset('courses');

        return insightF.addDataset('courses', data).then( (value: InsightResponse)=> {

            let a = value;
            expect(a.code).to.deep.equal(204);
            let m = fs.existsSync('./test/data/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getDataController().getDataInMemory().has("courses");
            expect(dataID).to.be.true;
            let dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
            expect(dataSize).to.equal(64612)
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });

    });

    it("simple test for addDataset with courses.zip, with code 201", function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        //insightF.removeDataset('courses');

        return insightF.addDataset("courses", data).then(function (value: InsightResponse) {
            return insightF.addDataset("courses", data).then((value)=> {
                let a = value;
                expect(a.code).to.deep.equal(201);
                let m = fs.existsSync('./test/data/courses.txt');
                expect(m).to.be.true;
                let dataID = insightF.getDataController().getDataInMemory().has("courses");
                expect(dataID).to.be.true;
                let dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
                expect(dataSize).to.equal(64612)
            }).catch(function(err: InsightResponse){
                expect.fail();
            })

        }).catch(function (err: InsightResponse) {
            expect.fail();
        });

    });


})
import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testAddData", function() {
    this.timeout(10000);
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

        let data =fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        insightF.addDataset("courses", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(201);

            let m = fs.existsSync('./src/controller/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getValue().has("courses");
            expect(dataID).to.be.true;

        }).then(()=>{ insightF.removeDataset("courses").then(function (value: InsightResponse) {
            let m = value;
            expect(m.code).to.deep.equal(204);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;

        }).catch(function () {
            expect.fail();

        });
        }).catch(function () {
            expect.fail();
        });


        done();

    });


    it("Import course.zip and then invalid2.zip ，store the data of course but not invalid2", function (done) {

        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        insightF.addDataset("courses", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(204);

            let m = fs.existsSync('./src/controller/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getValue().has("courses");
            expect(dataID).to.be.true;
            let data = fs.readFileSync(__dirname + '/data/invalid2.zip', "base64")
        }).then(() => {
            insightF.addDataset("invalid2", data).then(function (value: InsightResponse) {
                expect.fail();

            }).catch(function (err: InsightResponse) {
                let a = err;
                expect(a.code).to.deep.equal(400);
                let ifFileExist = fs.existsSync('./src/controller/invalid2');
                expect(ifFileExist).to.be.false;
            });
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });
        done();
    });

    it("Import valid.zip ，store the data and remove successfully", function (done) {

        let data = fs.readFileSync(__dirname + '/data/valid.zip', "base64");

        insightF.addDataset("smallValid", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(204);
            let m = fs.existsSync('./src/controller/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getValue().has("smallValid");
            expect(dataID).to.be.true;
        }).then(()=>{insightF.removeDataset("smallValid").then(function (value: InsightResponse) {
            let m = value;
            expect(m.code).to.deep.equal(204);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;
        }).catch(function (value: InsightResponse) {
            expect.fail();
        });
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });

        done();
    })




    it("Import course.zip ，store the data and remove unsuccessfully", function (done) {

        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64") ;

        insightF.addDataset("courses", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(204);
            let m = fs.existsSync('./src/controller/courses.txt');
            expect(m).to.be.true;
            let dataID = insightF.getValue().has("courses");
            expect(dataID).to.be.true;}).then(()=>{insightF.removeDataset("Empty").then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (value: InsightResponse) {
            let m = value;
            expect(m.code).to.deep.equal(404);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.true;
        });
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });

        done();
    })



    it.only("Import emptyFolder2.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/emptyFolder2.zip', "base64");


        return insightF.addDataset("emptyFolder2", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/emptyFolder2');
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
            let ifFileExist = fs.existsSync('./src/controller/biginvalid');
            expect(ifFileExist).to.be.false;
        });

    });


    it("run this and remove courses.txt",function(){
        if(fs.existsSync('./src/controller/courses.txt')){
            fs.unlinkSync('./src/controller/courses.txt');
        }
    });

    it("Import invalid.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");


        return insightF.addDataset("invalid", data).then(function (value: any) {
            let a = value;
            expect.fail();

        }).catch(function (err: any) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
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
            let ifFileExist = fs.existsSync('./src/controller/datat.txt');
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
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;

        });
    });

    it("Given an invalid string and return 400", function () {

        return insightF.addDataset("Empty", "A").then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;

        });
    });

    it("Test remove when not in memory but file exist", function (done) {

        let data = fs.readFileSync(__dirname + '/data/valid.zip', "base64");

        insightF.addDataset("valid", data).then(function (value: InsightResponse) {

            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.true;}).then(()=>{
            insightF.removeDataset("valid").then(function (value: InsightResponse) {
                let m = value;
                expect(m.code).to.deep.equal(204);
                let ifFileExist = fs.existsSync('./src/controller/courses.txt');
                expect(ifFileExist).to.be.false;
            }).catch(function (value: InsightResponse) {
                expect.fail();
            });
        }).catch(function (err: InsightResponse) {
            expect.fail();
        });
        done();
    })



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

    it("Import invalid.zip, it should return code 400", function () {
        let data = fs.readFileSync(__dirname + '/data/invalid.zip', "base64");


        return insightF.addDataset("Empty", data).then(function (value: InsightResponse) {
            expect.fail();

        }).catch(function (err: InsightResponse) {
            let a = err;
            expect(a.code).to.deep.equal(400);
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
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
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
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
            let ifFileExist = fs.existsSync('./src/controller/courses.txt');
            expect(ifFileExist).to.be.false;
        });

    });

})
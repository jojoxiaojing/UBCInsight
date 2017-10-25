import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

var fs = require("fs");


describe("testAddRoomsData", function () {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        //Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        insightF.removeDataset('rooms')
        insightF.addDataset('courses', data)
    });

    after(function () {
        if(fs.existsSync('./src/controller/rooms.txt')){
            fs.unlinkSync('./src/controller/rooms.txt');
        }
    })

    afterEach(function () {
    });


    it("Import rooms.zip ，store the data and remove successfully", function () {

        let data = fs.readFileSync(__dirname + '/data/rooms.zip', "base64");

        return insightF.addDataset("rooms", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(204);

            let m = fs.existsSync('./src/controller/rooms.txt');
            expect(m).to.be.true;
            let dataID = insightF.getDataController().getDataInMemory().has("rooms");
            expect(dataID).to.be.true;

        }).then(() => {
            insightF.removeDataset("rooms").then(function (value: InsightResponse) {
                let m = value;
                expect(m.code).to.deep.equal(204);
                let ifFileExist = fs.existsSync('./src/controller/rooms.txt');
                expect(ifFileExist).to.be.false;

            }).catch(function () {
                expect.fail();

            });
        }).catch(function () {
            expect.fail();

        });


    });



    it("Import rooms.zip ，and perform queries on both rooms and courses sequentially", function () {

        let data = fs.readFileSync(__dirname + '/data/rooms.zip', "base64");

        return insightF.addDataset("rooms", data).then(function (value: InsightResponse) {
            let a = value;
            expect(a.code).to.deep.equal(204);

            let m = fs.existsSync('./src/controller/rooms.txt');
            expect(m).to.be.true;
            let dataID = insightF.getDataController().getDataInMemory().has("rooms");
            expect(dataID).to.be.true;

        }).then(() => {
            var testQuery ={"WHERE": {"IS": {"courses_dept": "*ps"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                expect(value.code).to.equal(200);
                let m = value.body.result.length;
                expect(m).to.equal(806);
                let n =Object.keys(value.body.result[0]).length;
                expect(n).to.equal(3);
            }).catch(function(err:any){
                expect.fail();
            });
        }).then(()=> {
            var testQuery = {"WHERE": {"IS": {"rooms_address": "*Agrono*"}},"OPTIONS": {"COLUMNS": ["rooms_address", "rooms_name"]}}
            return insightF.performQuery(testQuery).then(function(value:any){
                expect(value.code).to.equal(200);
                let m = value.body.result.length;
                expect(m).to.equal(26);
                let n =Object.keys(value.body.result[0]).length;
                expect(n).to.equal(2);
            }).catch(function(err:any){
                expect.fail();
            });

        }).catch(function () {
            expect.fail();

        });


    });


})
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

  


})
import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testPerformQuery", function() {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        insightF = new InsightFacade();
        //insightF.removeDataset('rooms');
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    after(function() {
        insightF.removeDataset('rooms');
    })
//Not in memory

    it("Import rooms.zip and store the data, it should return code 204", function () {
        let data  = fs.readFileSync(__dirname + '/data/rooms.zip', "base64");

        return insightF.addDataset("rooms", data).then(function (value: any) {
            let a = value;
            expect(a.code).to.deep.equal(204);
            let dataID = insightF.getDataController().getDataInMemory().has("rooms");
            expect(dataID).to.be.true;
            let dataSize = insightF.getDataController().getDataInMemory().get("rooms").length;
            expect(dataSize).to.equal(364)

        }).catch(function (err) {
            expect.fail();
        });
    });



    it("Test performQuery, just IS with no *, it should return 200 and xx length of data ", function () {
        var testQuery = {"WHERE": {"IS": {"rooms_name": "DMP_*"}},"OPTIONS": {"COLUMNS": ["rooms_name"], "ORDER": "rooms_name"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(5);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(1);
        }).catch(function(err:any){
            expect.fail();
        });
    });







})
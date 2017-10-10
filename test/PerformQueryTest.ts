import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testPerformQuery", function() {
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



    /*
        it("Test performQuery, broken: without where/options", function () {
           return insightF.performQuery({OR: [{LT: {courses_audit: 20}}, {AND: [{EQ: {courses_avg: 90}}, {EQ: {courses_audit: 50}}]}]}).then(function(value:any){
                expect.fail();
            }).catch(function(response:any){
                expect(response.code).to.equal(400);
            });
        });
    */

    /*    it("Test performQuery", function (done) {
            insightF.performQuery({WHERE: {AND: [{LT: {courses_audit: 30}}, {OR: [{GT: {courses_fail: 10}},
                {GT: {courses_pass: 50}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            ).then(function(response: InsightResponse){
                    var a = response;
                    done()
                //expect.fail();
            }).catch(function(response: InsightResponse){
                //expect(response.code).to.equal(200);
            });
        });*/




    it("Test performQuery, invalid query returning 400 code", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            //insightF.addDataset("Courses",data);
            var testQuery = {THERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(400);
                done();

            }).catch(function(err:any){
            });
        });
    });

    it("Test performQuery, real query ", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            //insightF.addDataset("Courses",data);
            var testQuery = {WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);
                done();
            }).catch(function(err:any){
            });
        });
    });

})
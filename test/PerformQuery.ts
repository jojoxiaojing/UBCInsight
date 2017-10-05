import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
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

/*    it("Test performQuery", function (done) {




        insightF.performQuery("111").then(function(value:any){
            let a = value;
            done();


        }).catch(function(err:any){


        });


    });*/


    it("Test performQuery, real query", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            insightF.addDataset("Courses",data);
            var testQuery = {WHERE: {AND: [{LT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}}
            insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                done();


            }).catch(function(err:any){


            });

        });



    });

})
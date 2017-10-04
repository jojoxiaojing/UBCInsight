import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
var fs = require("fs");


describe("testPerformQuery", function() {
    this.timeout(1000000);
    var insightF: InsightFacade;
    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Test performQuery", function (done) {

        fs.readFile('/Users/Jojo/Documents/9.UBC/Javascript/310/D1/cpsc310_team45/src/controller/data/data.txt', 'utf-8', function(err:any, data:string) {
            let a = data;

        });
        // fs.readFile("/Users/Jojo/Documents/9.UBC/Javascript/310/D1/cpsc310_team45/src/controller/data/data.txt")
        //     .then(function(data:any){
        //         let a = data;
        //         done();
        //     }).catch(function(err:any){
        //         let e = err;
        //     done();
        // });
        insightF.performQuery("111").then(function(value:any){
            let a = value;
            done();


        }).catch(function(err:any){


        });


    });
})